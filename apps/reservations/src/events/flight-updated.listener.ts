import { Service } from 'typedi';

import { BaseListener } from './base.listener';
import { FlightUpdatedEvent } from './flight-updated.event';
import { RabbitClientWrapper } from '../infrastructure/rabbitmq-client.wrapper';

@Service()
export class FlightUpdatedListener extends BaseListener<FlightUpdatedEvent> {
    public exchangeName: string = 'exchange.flight.updated';
    public queueName: string = 'reservations.flight.updated';

    constructor(
        protected readonly rabbitClientWrapper: RabbitClientWrapper
    ) {
        super(rabbitClientWrapper);
    }
    
    protected onMessage(message: any): void {
        console.log(message);
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

}