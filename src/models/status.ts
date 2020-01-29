import { Schema, model, Types, Model, Document } from 'mongoose';

const statusSchema: Schema = new Schema({
    title: {
        type: String,
    },
    employeeId: {
        type: Types.ObjectId,
        ref: 'Employee',
        required: true,
    },
});

interface Status extends Document {
    title: string;
}

const StatusModel: Model<Status> = model<Status>('Status', statusSchema);

export default StatusModel;
