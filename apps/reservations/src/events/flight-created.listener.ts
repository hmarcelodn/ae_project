import amqp from 'amqplib';
import { Service } from 'typedi';

import { BaseListener } from './base.listener';
import { FlightCreatedEvent } from './flight-created.event';
import { RabbitClientWrapper } from '../infrastructure/rabbitmq-client.wrapper';

@Service()
export class FlightCreatedListener extends BaseListener<FlightCreatedEvent> {
    exchangeName: string = 'exchange.flight.created';
    queueName: string = 'reservations.flight.created';

    constructor(
        protected readonly rabbitClientWrapper: RabbitClientWrapper
    ) {
        super(rabbitClientWrapper);
    }

    protected async setup() {
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

    protected onMessage(message: any): void {
        console.log('onMessage', message);
    }
}
