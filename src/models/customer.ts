import { Schema, model, Types, Model, Document } from 'mongoose';

const customerSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    order: [{ type: Types.ObjectId, ref: 'Order' }],
});

export interface Customer extends Document {
    email: string;
    password: string;
    name: string;
    lastName: string;
    order: [];
}

const CustomerModel: Model<Customer> = model<Customer>('Customer', customerSchema);

export default CustomerModel;
