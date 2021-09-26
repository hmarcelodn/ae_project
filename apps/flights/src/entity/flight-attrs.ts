import { FlightStatus } from './flight';

export interface FlightAttrs {
    airline: string;
    airportFrom: string;
    airportTo: string;
    code: string;
    departure: Date;
    arrival: Date;
    status: FlightStatus;
};