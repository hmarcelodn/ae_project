import express from 'express';

class App {
    public app: express.Application;
    public port: number;

    constructor(controllers: Array<any>, port: number) {
        this.app = express();
        this.port = port;

        this.initializeMiddlewares();
        this.initializeControllers(controllers);
    }

    protected initializeMiddlewares() {
        this.app.use(express.json());
    }

    protected initializeControllers(controllers: Array<any>) {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        })
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server running at port ${this.port}...`);
        });
    }
}

export default App;
