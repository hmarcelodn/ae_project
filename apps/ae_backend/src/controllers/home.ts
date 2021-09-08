import express from 'express';
import {Service} from 'typedi';

@Service()
class HomeController {
    public path = '/';
    public router = express.Router();

    constructor() {
        this.initializeRouter()
    }

    home(req: express.Request, res: express.Response, next: express.NextFunction) {
        res.json({ message: 'es' });
        next();
    }

    protected initializeRouter() {
        this.router.use(this.path, this.home);
    }
}

export default HomeController;
