import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFlights } from '../../redux/actions/flight';

export const Dashboard = () => {

    const dispatch = useDispatch();
    const flights = useSelector(state => state.flights.flights);
    const loading = useSelector(state => state.flights.loading);
    const error = useSelector(state => state.flights.error);

    console.log(flights);

    useEffect(() => {
        dispatch(getFlights());
    }, [dispatch]);

    return (
        <>
            <h1>Welcome to Huemul Flights!</h1>

            {flights.loading && <p>Loading...</p>}
            {flights.length === 0 && !loading && <p>No flights available!</p>}
            {error && !loading && <p>{error}</p>}
            {flights.length > 0 && flights.map((flight) => {
                return (
                    <div>
                        <p>Airline: {flight.airline}</p>
                        <p>Code: {flight.code}</p>
                    </div>
                )
            })}
        </>
    )
};
