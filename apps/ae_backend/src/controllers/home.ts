import express from 'express';
import {Service} from 'typedi';

import BaseController from './base';

@Service()
class HomeController extends BaseController {
    public path = '/';

    constructor() {
        super();
        this.initializeRouter()
    }

    home(req: express.Request, res: express.Response, next: express.NextFunction) {
        res.json({ message: 'Welcome to AgileEngine!' });
        next();
    }

    protected initializeRouter(): void {
        this.router.use(this.path, this.home);
    }

}

export default HomeController;
