import * as type from '../types';

const initialState = {
    flights: [],
};

export default function flights(state = initialState, action) {
    switch (action.type) {
        case type.GET_FLIGHTS_REQUESTED:
            return {
                ...state,
                loading: true,
            };
        case type.GET_FLIGHTS_SUCCESS:
            return {
                ...state,
                loading: false,
                flights: action.flights,
            }
        case type.GET_FLIGHTS_FAILED:
            return {
                ...state,
                loading: false,
                error: action.message,
            }
        default:
            return state;
    }
}
