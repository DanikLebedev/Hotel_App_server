import { Schema, model, Types, Document, Model } from 'mongoose';
const roomSchema: Schema = new Schema(
    {
        category: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        area: {
            type: Number,
            required: true,
        },
        guests: {
            type: Number,
            required: true,
        },
        rooms: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        beds: {
            type: Number,
            required: true,
        },
        food: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

export interface RoomInt extends Document {
    category: string;
    userId: string;
    isBooked: boolean;
    title: string;
    price: number;
    area: number;
    guests: number;
    rooms: number;
    description: string;
    image: string;
}

const RoomModel: Model<RoomInt> = model<RoomInt>('Room', roomSchema);

export default RoomModel;
