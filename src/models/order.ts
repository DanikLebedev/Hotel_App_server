import { Schema, model, Types, Model, Document } from 'mongoose';

const orderSchema: Schema = new Schema({
    customerId: {
        type: Types.ObjectId,
        ref: 'Customer',
    },
    roomId: {
        type: Types.ObjectId,
        ref: 'Room',
    },
});

interface Order extends Document {
    customerId: string;
    roomId: string;
}

const OrderModel: Model<Order> = model<Order>('Order', orderSchema);

export default OrderModel;
