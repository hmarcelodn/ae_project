import { Service } from 'typedi';
import { Message } from 'amqplib';

import { BaseListener } from './base.listener';
import { Flight } from './../models/flight.model';
import { FlightCreatedEvent } from './flight-created.event';
import { RabbitClientWrapper } from '../infrastructure/rabbitmq-client.wrapper';

@Service()
export class FlightCreatedListener extends BaseListener<FlightCreatedEvent> {
    protected readonly exchangeName: string = 'exchange.flight.created';
    protected readonly queueName: string = 'reservations.flight.created';

    constructor(
        protected readonly rabbitClientWrapper: RabbitClientWrapper
    ) {
        super(rabbitClientWrapper);
    }

    protected async setup(): Promise<void> {
        const { channel } = this.rabbitClientWrapper;

        await channel.assertExchange(
            this.exchangeName, 
            'fanout', {
            durable: false
        });

        await channel.assertQueue(
            this.queueName,
            { durable: false, exclusive: false }
        );

        await channel.bindQueue(
            this.queueName,
            this.exchangeName,
            '',
            { noAck: false, exclusive: false }
        );
    }

    protected async onMessage(data: FlightCreatedEvent, message: Message | null): Promise<void> {
        const {
            flightId,
        } = data;

        Flight.findOneAndUpdate({ flightId: flightId }, data, { upsert: true }, (err) => {
            if (!err) {
                this.rabbitClientWrapper.channel.ack(message!);
            }
        });
    }
}
