import { Message } from 'amqplib';
import { Service } from 'typedi';

import { BaseListener } from './base.listener';
import { Flight } from '../models/flight.model';
import { FlightUpdatedEvent } from './flight-updated.event';
import { RabbitClientWrapper } from '../infrastructure/rabbitmq-client.wrapper';

@Service()
export class FlightUpdatedListener extends BaseListener<FlightUpdatedEvent> {
    protected readonly exchangeName: string = 'exchange.flight.updated';
    protected readonly queueName: string = 'reservations.flight.updated';

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

    protected async onMessage(data: FlightUpdatedEvent, message: Message | null): Promise<void> {
        const {
            flightId,
        } = data;
        
        Flight.findOneAndUpdate({ flightId: flightId }, data, { upsert: false }, (err) => {
            if (!err) {
                this.rabbitClientWrapper.channel.ack(message!);
            }
        });
    }

}