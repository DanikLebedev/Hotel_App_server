import { Schema, model, Types, Document, Model } from 'mongoose';
const roomSchema: Schema = new Schema({
    category: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    status: {
        type: Number,
        required: true,
    },
    bedsQuantity: {
        type: Number,
        required: true,
    },
    area: {
        type: Number,
        required: true,
    },
    userId: {
        type: Types.ObjectId,
        ref: 'User',
    },
    isBooked: Boolean,
    description: String,
    image: String,
});

interface Room extends Document {
    category: string;
    price: number;
    status: number;
    bedsQuantity: number;
    area: number;
    userId: string;
    isBooked: boolean;
    description: string;
    image: string;
}

const RoomModel: Model<Room> = model<Room>('Room', roomSchema);

export default RoomModel;
