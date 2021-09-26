import { RabbitClientWrapper } from "../infrastructure/rabbitmq-client.wrapper";

export abstract class BasePublisher<T> {
    abstract exchangeName: string;

    constructor(
        protected readonly rabbitClientWrapper: RabbitClientWrapper,
    ) {}

    async initialize() {
        await this.initializeQueues();
    }

    protected abstract initializeQueues(): Promise<void>;

    publish(data: T): void {
        const channel = this.rabbitClientWrapper.channel;

        channel.publish(
            this.exchangeName,
            '',
            new Buffer(JSON.stringify(data))
        );
    };
}