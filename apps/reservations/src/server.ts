import 'reflect-metadata';
import mongoose from 'mongoose';
import Container from 'typedi';

import { App } from './app';
// import { ReservationController } from './controllers/reservation.controller';
import { FlightCreatedListener } from './events/flight-created.listener';
import { FlightUpdatedListener } from './events/flight-updated.listener';
import { RabbitClientWrapper } from './infrastructure/rabbitmq-client.wrapper';

const rabbitClientWrapper = Container.get(RabbitClientWrapper);
const flightCreatedListener = Container.get(FlightCreatedListener);
const flightUpdatedListener = Container.get(FlightUpdatedListener);

Promise.resolve()
.then(() => rabbitClientWrapper.connect())
.then(() => mongoose.connect('mongodb+srv://root:root@cluster0.l66sz.mongodb.net/reservations?retryWrites=true&w=majority'))
.then(() => flightCreatedListener.listen())
.then(() => flightUpdatedListener.listen())
.then(() => {
    // const reservationController = Container.get(ReservationController);
    const app = new App(Number(process.env.PORT) || 3001);
    app.listen();
});
