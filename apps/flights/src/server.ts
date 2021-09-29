import 'reflect-metadata';
import {Container} from 'typedi';

import App from './app';
import BaseController from './controllers/base';
import FlightsController from './controllers/flights.controller';
import { PostgresClient } from './infrastructure/postgres-client.wrapper';
import { RabbitClientWrapper } from './infrastructure/rabbitmq-client.wrapper';

const postgresClientWrapper = Container.get(PostgresClient);
const rabbitmqClientWrapper = Container.get(RabbitClientWrapper);

Promise.resolve()
.then(() => postgresClientWrapper.connect())
.then(() => rabbitmqClientWrapper.connect())
.then(() => {
    const flightsController = Container.get(FlightsController);
    
    const controllers: Array<BaseController> = [
        flightsController
    ];

    const app = new App(controllers, Number(process.env.PORT) || 3001);
    app.listen();
});
