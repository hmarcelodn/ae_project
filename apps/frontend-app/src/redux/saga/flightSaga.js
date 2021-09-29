import { call, put, takeEvery } from 'redux-saga/effects';

const apiUrl = `http://localhost:3001`;

function getFlights() {
    return fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .catch(error => { 
        throw error
    });
}

function* fetchFlights(action) {
    try {
        const flights = yield call(getFlights);
        console.log('test',flights);
        yield put({ type: 'GET_FLIGHTS_SUCCESS', flights: (flights || []) });
    } catch (e) {
        yield put({ type: 'GET_FLIGHTS_FAILED', message: e.message });
    }
}

function* flightSaga() {
    yield takeEvery('GET_FLIGHTS_REQUESTED', fetchFlights);
}

export default flightSaga;
