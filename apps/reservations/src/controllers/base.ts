import express from 'express';

abstract class BaseController {
    public router: express.IRouter;
    public abstract path: string;

    constructor() {
        this.router = express.Router();;
    }

    protected abstract initializeRouter(): void;
}

export default BaseController;
