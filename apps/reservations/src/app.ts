import express from 'express';
import cors from 'cors';

export class App {
    public app: express.Application;
    public port: number;

    constructor(port: number) {
        this.app = express();
        this.port = port;
    }

    listen(): void {
        this.app.use(cors())
        this.app.listen(this.port, () => {
            console.log(`Service listening at port: ${this.port}`);
        });
    }
}