import { Schema, model, Types, Model, Document } from 'mongoose';

const ordersCartSchema: Schema = new Schema({
    status: {
        type: String,
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
    checkOut: {
        type: Date,
        required: true,
    },
});

export interface OrderCart extends Document {
    status: string;
    orderId: string;
    category: string;
    checkIn: string;
    checkOut: string;
}

const OrderCartModel: Model<OrderCart> = model<OrderCart>('OrderCart', ordersCartSchema);

export default OrderCartModel;
