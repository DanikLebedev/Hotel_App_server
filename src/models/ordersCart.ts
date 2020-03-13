import { Schema, model, Types, Model, Document } from 'mongoose';

const ordersCartSchema: Schema = new Schema({
    status: {
        type: String,
        default: 'booked'
    },
    orderId: String,
    category: {
        type: String,
        required: true,
    },
    checkIn: {
        type: Date,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    checkOut: {
        type: Date,
        required: true,
    },
    guests: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    userEmail: String,
});

export interface OrderCart extends Document {
    status: string;
    orderId: string;
    category: string;
    checkIn: string;
    checkOut: string;
    userEmail: string;
    guests: string;
    comment: string;
    price: number;
    userId: string;
}

const OrderCartModel: Model<OrderCart> = model<OrderCart>('OrderCart', ordersCartSchema);

export default OrderCartModel;
