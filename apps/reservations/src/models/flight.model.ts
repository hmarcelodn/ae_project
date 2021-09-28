import { Schema, model } from 'mongoose';

// 1. Create an interface representing a document in MongoDB.
interface FlightAttrs {
    flightId: number;
    code: string;
};

// 2. Create a Schema corresponding to the document interface.
const schema = new Schema<FlightAttrs>({
    flightId: { type: Number, required: true },
    code: { type: String, required: true }
});

// 3. Create a Model.
const Flight = model<FlightAttrs>('Flight', schema);

export { Flight };
