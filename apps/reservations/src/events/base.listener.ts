import { Message } from 'amqplib';

import { RabbitClientWrapper } from '../infrastructure/rabbitmq-client.wrapper';

export abstract class BaseListener<T> {
    public abstract exchangeName: string;
    public abstract queueName: string;

    constructor(
        protected readonly rabbitClientWrapper: RabbitClientWrapper
    ) {}
    
    protected abstract onMessage(data: T, message: Message | null): Promise<void>;
    protected abstract setup(): Promise<void>;

    async listen() {
        await this.setup();

        const { channel } = this.rabbitClientWrapper;

        await channel.consume(this.queueName, async (message: Message | null) => {
            await this.onMessage(
                JSON.parse(message!.content.toString()),
                message
            );
        });
    }
}
