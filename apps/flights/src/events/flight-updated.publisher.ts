import { Service } from 'typedi';
import { RabbitClientWrapper } from '../infrastructure/rabbitmq-client.wrapper';
import { BasePublisher } from './base.publisher';
import { FlightUpdatedEvent } from './flight-updated.event';

@Service()
export class FlightUpdatedPublisher extends BasePublisher<FlightUpdatedEvent> {
    exchangeName: string = 'exchange.flight.updated';

    constructor(
        protected readonly rabbitClientWrapper: RabbitClientWrapper,
    ) {
        super(rabbitClientWrapper);
    }

    protected async initializeQueues(): Promise<void> {
        const { channel } = this.rabbitClientWrapper;

        await channel.assertExchange(
            this.exchangeName,
            'fanout',
            { durable: false }
        );

        await channel.assertQueue(
            'reservations.flight.updated',
            { durable: false, exclusive: false }
        );

        await channel.bindQueue(
            'reservations.flight.updated',
            this.exchangeName,
            '',
            { noAck: false, exclusive: false }
        );
    }
}