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

interface Employee extends Document {
    email: string;
    password: string;
    status: string;
}

const EmployeeModel: Model<Employee> = model<Employee>('Employee', employeeSchema);

export default EmployeeModel;
