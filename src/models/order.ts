import { Schema, model, Types, Model, Document } from 'mongoose';

const orderSchema: Schema = new Schema({
    owner: {
        type: Types.ObjectId,
        ref: 'Customer',
    },
    category: {
        type: String,
        required: true,
    },
    checkIn: {
        type: Date,
        required: true,
    },
    checkOut: {
        type: Date,
        required: true,
    },
    guests: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        default: 'booked',
    },
});

export interface Order extends Document {
    category: string;
    checkIn: Date;
    checkOut: Date;
    guests: number;
    status: string;
}

const OrderModel: Model<Order> = model<Order>('Order', orderSchema);

export default OrderModel;
