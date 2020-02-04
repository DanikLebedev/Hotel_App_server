import { Schema, model, Types, Model, Document } from 'mongoose';

const statusSchema: Schema = new Schema({
    title: {
        type: String,
        required: true

    },
});

export interface StatusInt extends Document {
    title: string;
}

const StatusModel: Model<StatusInt> = model<StatusInt>('Status', statusSchema);

export default StatusModel;
