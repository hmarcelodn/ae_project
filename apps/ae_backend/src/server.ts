import 'reflect-metadata';

import App from './app';
import {Container} from 'typedi';

import HomeController from './controllers/home';

const app = new App([
    Container.get(HomeController)
], Number(process.env.PORT) || 3000);

app.listen();
