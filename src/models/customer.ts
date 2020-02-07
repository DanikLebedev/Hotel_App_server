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
    order: [{ type: Types.ObjectId, ref: 'Order'}],
});

interface Customer extends Document {
    email: string;
    password: string;
}

const CustomerModel: Model<Customer> = model<Customer>('Customer', customerSchema);

export default CustomerModel;
