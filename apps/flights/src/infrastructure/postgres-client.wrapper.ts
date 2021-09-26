import 'reflect-metadata';
import { Service } from 'typedi';
import { createConnection, Connection } from 'typeorm';

@Service()
export class PostgresClient {
    protected _connection: Connection;

    constructor() {
        this.connect();
    }

    get connection(): Connection {
        return this._connection;
    }

    connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this._connection && this._connection.isConnected) {
                resolve();
            }

            createConnection().then(connection => {
                this._connection = connection;

                process.on('SIGINT', async () => {
                    await this._connection.close();
                });
        
                process.on('SIGTERM', async () => {
                    await this._connection.close();
                })

                resolve();
            }).catch(err => {
                reject(err);
            });
        });
    }
}
