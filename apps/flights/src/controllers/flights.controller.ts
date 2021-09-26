import { Response, Request, NextFunction } from 'express';
import { Service } from 'typedi';
import { getRepository } from 'typeorm';

import BaseController from './base';
import { Flight, FlightStatus } from '../entity/flight';
import { FlightCreatedPublisher } from '../events/flight-created.publisher';
import { FlightUpdatedPublisher } from '../events/flight-updated.publisher';

@Service()
class FlightsController extends BaseController {
    public path = '/';

    constructor(
        protected readonly flightCreatedPublisher: FlightCreatedPublisher,
        protected readonly flightUpdatedPublisher: FlightUpdatedPublisher,
    ) {
        super();

        this.initializePublishers();
        this.initializeRouter();
    }

    protected async initializePublishers() {
        await this.flightCreatedPublisher.initialize();
        await this.flightUpdatedPublisher.initialize();
    }

    async create(req: Request, res: Response, next: NextFunction) {
        const {
            airline,
            airportFrom,
            airportTo,
            arrival,
            departure,
            code,
        } = req.body;

        const flightRepository = getRepository(Flight);

        let newFlight = new Flight();
        newFlight.airline = airline;
        newFlight.airportFrom = airportFrom;
        newFlight.airportTo = airportTo;
        newFlight.arrival = arrival;
        newFlight.departure = departure;
        newFlight.code = code;
        newFlight.status = FlightStatus.ONTIME;

        newFlight = await flightRepository.save(newFlight);

        this.flightCreatedPublisher.publish({
            flightId: newFlight.id,
            code: newFlight.code
        });

        res.status(201).json(newFlight);

        return next();
    }

    async update(req: Request, res: Response, next: NextFunction) {
        const {
            arrival,
            departure,
            status,
            id,
        } = req.body;

        const flightRepository = await getRepository(Flight);

        let flightToUpdate = await flightRepository.findOne(id);        
        if (flightToUpdate) {
            flightToUpdate.arrival = arrival;
            flightToUpdate.departure = departure;

            if (status === 'ontime') {
                flightToUpdate.status = FlightStatus.ONTIME;
            } else if (status === 'delayed') {
                flightToUpdate.status = FlightStatus.DELAYED;
            } else {
                flightToUpdate.status = FlightStatus.CANCELLED;
            }

            flightToUpdate = await flightRepository.save(flightToUpdate);

            this.flightUpdatedPublisher.publish({
                flightId: flightToUpdate.id,
                arrival: flightToUpdate.arrival,
                departure: flightToUpdate.departure,
                status: flightToUpdate.status,
            });

            res.status(200).json(flightToUpdate);
        } else {
            res.status(404).send();
        }

        return next();
    }

    protected initializeRouter = (): void => {
        this.router.post(this.path, this.create.bind(this));
        this.router.put(this.path, this.update.bind(this));
    }

}

export default FlightsController;
