import amqp from 'amqplib';
import { Service } from 'typedi';

@Service()
export class RabbitClientWrapper {
    protected _conn: amqp.Connection;
    protected _ch: amqp.Channel;

    get connection(): amqp.Connection {
        return this._conn;
    }

    get channel(): amqp.Channel {
        return this._ch;
    }

    async connect(): Promise<void> {
        try {
            const rabbitUrl = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672/';
            
            if (!this._conn && !this._ch) {
                console.log('connection todavia no existe');
                this._conn = await amqp.connect(rabbitUrl);
                this._ch = await this._conn.createChannel();

                process.on('SIGINT', async () => {
                    await this._ch.close();
                    await this._conn.close();
                });
    
                process.on('SIGTERM', async () => {
                    await this._ch.close();
                    await this._conn.close();
                });
            } else {
                console.log('connection ya existe');
            }
        } catch (err) {
            throw err;
        }
    }
}
