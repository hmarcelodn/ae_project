import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

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

}
