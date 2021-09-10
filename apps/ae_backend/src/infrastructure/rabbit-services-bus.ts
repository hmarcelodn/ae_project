import amqp from 'amqplib';
import { Service } from 'typedi';

@Service()
class RabbitServiceBus {
    protected conn: amqp.Connection | undefined;
    protected channel: amqp.Channel | undefined;
    protected readonly WORKERS_EXCHANGE = 'workers.exchange';
    protected readonly WORKERS_QUEUE = 'ae_workers02';

    constructor() {
        const rabbitUrl = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672/';

        // Connect
        amqp.connect(rabbitUrl).then(async connection => {
            // Channel
            const channel = await connection.createChannel();

            // Exchange
            await channel.assertExchange(
                this.WORKERS_EXCHANGE, 
                'direct', 
                { durable: false }
            );
            
            // Queue
            await channel.assertQueue(
                this.WORKERS_QUEUE, 
                { durable: false, exclusive: false }
            );

            // Binding
            await channel.bindQueue(
                this.WORKERS_QUEUE, 
                this.WORKERS_EXCHANGE, 
                this.WORKERS_QUEUE, 
                { noAck: false, exclusive: false }
            );
            
            this.conn = connection;
            this.channel = channel;
        });

        process.on('beforeExit', async (code: number) => {
            await this.channel?.close();
            await this.conn?.close();
        });
    }

    send = () => {
        this.channel?.publish(
            this.WORKERS_EXCHANGE,
            this.WORKERS_QUEUE, 
            new Buffer('hello from rabbit')
        );
    }
}

export default RabbitServiceBus;
