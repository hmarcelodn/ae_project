import { Channel, ConsumeMessage } from 'amqplib';

import { RabbitClientWrapper } from '../infrastructure/rabbitmq-client.wrapper';

export abstract class BaseListener<T> {
    public abstract exchangeName: string;
    public abstract queueName: string;

    constructor(
        protected readonly rabbitClientWrapper: RabbitClientWrapper
    ) {}
    
    protected abstract onMessage(message: T): void;
    protected abstract setup(): void;

    async listen() {
        await this.setup();

        const { channel } = this.rabbitClientWrapper;

        await channel.consume(this.queueName, (message: any) => {
            this.onMessage(JSON.parse(message.content.toString()));
        });
    }
}
