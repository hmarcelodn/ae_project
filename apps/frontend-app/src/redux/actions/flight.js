import * as type from '../types';

export function getFlights(flights) {
    return {
        type: type.GET_FLIGHTS_REQUESTED,
    }
};
