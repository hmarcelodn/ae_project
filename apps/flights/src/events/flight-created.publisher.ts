import { Service } from 'typedi';
import { RabbitClientWrapper } from '../infrastructure/rabbitmq-client.wrapper';
import { BasePublisher } from './base.publisher';
import { FlightCreatedEvent } from './flight-created.event';

@Service()
export class FlightCreatedPublisher extends BasePublisher<FlightCreatedEvent> {
    exchangeName: string = 'exchange.flight.created';
    
    constructor(
        protected readonly rabbitClientWrapper: RabbitClientWrapper,
    ) {
        super(rabbitClientWrapper);
    }

    protected async initializeQueues(): Promise<void> {
        // await this.rabbitClientWrapper.connect();

        const { channel } = this.rabbitClientWrapper;

        // Exchanges
        await channel.assertExchange(
            this.exchangeName,
            'fanout', 
            { durable: false }
        );

        // Queues
        await channel.assertQueue(
            'reservations.flight.created',
            { durable: false, exclusive: false }
        );

        // Bindings
        await channel.bindQueue(
            'reservations.flight.created',
            this.exchangeName,
            '',
            { noAck: false, exclusive: false }
        );
    }
}
