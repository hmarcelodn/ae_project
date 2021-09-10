import amqp, { Message } from 'amqplib';

const rabbitUrl = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672/';
amqp.connect(rabbitUrl).then(async connection => {
    const channel = await connection.createChannel();
    channel.consume('ae_workers02', (msg: Message | null) => {
        setTimeout(() => {
            console.log('processing');
            channel.ack(msg!);
        }, 8000);
    });
})