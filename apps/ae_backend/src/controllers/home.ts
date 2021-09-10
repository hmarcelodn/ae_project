import express from 'express';
import Bull from 'bull';
import { Service } from 'typedi';

import BaseController from './base';
import RabbitServiceBus from '../infrastructure/rabbit-services-bus';

@Service()
class HomeController extends BaseController {
    public path = '/';   
    protected queue: Bull.Queue;

    constructor(
        protected rabbitmqServiceBus: RabbitServiceBus
    ) {
        super();
        this.queue = new Bull('intensive_queue', 'redis://127.0.0.1:6379');
        this.initializeRouter();
    }

    home = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
        res.json({ message: 'Welcome to AgileEngine!' });
        next();
    }

    long = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
        const job = this.queue.add({
            foo: 'bar',
        }, {
            attempts: 5,
            backoff: 5000
        });

        job.then(data => {
            console.log('job completed');
        }).catch(err => {
            console.log('job error', err);
        });

        res.sendStatus(200);
        next();
    }

    veryLong = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        this.rabbitmqServiceBus.send();
        res.sendStatus(200);
        next();
    }

    protected initializeRouter = (): void => {
        this.router.get(this.path, this.home);
        this.router.post(this.path, this.long);
        this.router.post(`${this.path}verylong`, this.veryLong);
    }

}

export default HomeController;
