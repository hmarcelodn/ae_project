import express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import BaseController from './controllers/base';
import Container from 'typedi';
import { PostgresClient } from './infrastructure/postgres-client.wrapper';
import { RabbitClientWrapper } from './infrastructure/rabbitmq-client.wrapper';

class App {
    public app: express.Application;
    public port: number;

    constructor(
        controllers: Array<BaseController>, 
        port: number
    ) {
        this.app = express();
        this.port = port;

        this.initializeClients();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
    }

    protected initializeClients(): void {
        const postgresClientWrapper = Container.get(PostgresClient);
        const rabbitmqClientWrapper = Container.get(RabbitClientWrapper);

        postgresClientWrapper
            .connect()
            .then(() => console.log('postgres: connection success.'))
            .catch(() => console.log('postgres: connection failed.'));

        rabbitmqClientWrapper
            .connect()
            .then(() => console.log('rabbitmq: connection success.'))
            .catch(() => console.log('rabbitmq: connection failed.'));
    }

    protected initializeMiddlewares(): void {
        this.app.use(express.json());
        this.app.use(compression());
        this.app.use(cookieParser());
        this.app.use(cors());
    }

    protected initializeControllers(controllers: Array<BaseController>): void {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        })
    }

    listen(): void {
        this.app.listen(this.port, () => {
            console.log(`Server running at port ${this.port}...`);
        });
    }
}

export default App;
