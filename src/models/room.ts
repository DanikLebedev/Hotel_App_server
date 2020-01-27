import { Schema, model, Types, Document, Model } from 'mongoose';
const roomSchema: Schema = new Schema({
    category: {
        type: String,
        required: true,
        categoryId: Types.ObjectId,
        ref: 'Category',
    },
    userId: {
        type: Types.ObjectId,
        ref: 'User',
    },
    isBooked: Boolean,
});

interface Room extends Document {
    category: string;
    userId: string;
    isBooked: boolean;
}

const RoomModel: Model<Room> = model<Room>('Room', roomSchema);

export default RoomModel;
