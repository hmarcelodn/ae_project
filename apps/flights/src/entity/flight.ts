import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import { FlightAttrs } from "./flight-attrs";

export enum FlightStatus {
    ONTIME = 'ontime',
    DELAYED = 'delayed',
    CANCELLED = 'cancelled'
}

@Entity()
export class Flight {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    airline: string;

    @Column()
    airportFrom: string;

    @Column()
    airportTo: string;

    @Column()
    code: string;

    @Column()
    departure: Date;

    @Column()
    arrival: Date;

    @Column({
        type: 'enum',
        enum: ['ontime', 'delayed', 'cancelled']
    })
    status: FlightStatus;

    static build(attrs: FlightAttrs): Flight {
        const flight = new Flight();
        flight.airline = attrs.airline;
        flight.airportFrom = attrs.airportFrom;
        flight.airportTo = attrs.airportTo;
        flight.arrival = attrs.arrival;
        flight.departure = attrs.departure;
        flight.code = attrs.code;
        flight.status = attrs.status;

        return flight;
    }

}
