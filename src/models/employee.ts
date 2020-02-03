import { Schema, model, Types, Model, Document } from 'mongoose';

const employeeSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true
    },
});

export interface EmployeeI extends Document {
    email: string;
    password: string;
    status: string;
}

const EmployeeModel: Model<EmployeeI> = model<EmployeeI>('Employee', employeeSchema);

export default EmployeeModel;
