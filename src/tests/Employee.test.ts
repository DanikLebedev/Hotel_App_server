import mongoose from 'mongoose';
import keys from '../../keys/keys';
import EmployeeInterlayer from '../interlayers/employee.interlayer';
import EmployeeModel from '../models/employee';

const employeeData = {
    email: 'lebed_alexandr@mail.ru',
    password: '123123',
    status: 'manager',
};

const updateEmployeeData = {
    status: 'manager',
    _id: '5e47d208cded483574e86f00',
};

const deleteData = {
    _id: '5e47d23ccded483574e86f01',
};

describe('Room model Testing', () => {
    beforeAll(async () => {
        await mongoose.connect(
            keys.MONGODB_URI,
            { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false },
            err => {
                if (err) {
                    console.error(err);
                    process.exit(1);
                }
            },
        );
    });
    it('should get all employee', async () => {
        const validEmployee = await EmployeeInterlayer.getAllEmployees(EmployeeModel);
        expect(validEmployee).toBeDefined();
        expect(validEmployee[0].email).toBeDefined();
    });

    it('should create new employee', async () => {
        const validEmployee = await EmployeeInterlayer.postEmployees(employeeData, EmployeeModel);
        expect(validEmployee).toBeDefined();
        expect(validEmployee['email']).toBe(employeeData['email']);
    });

    it('should delete employee', async () => {
        const validCustomers = await EmployeeInterlayer.deleteEmployee(deleteData, EmployeeModel);
        expect(validCustomers).toBeDefined();
        expect(validCustomers['email']).toBe(deleteData['email']);
    });

    it('should update employee', async () => {
        const validCustomers = await EmployeeInterlayer.deleteEmployee(updateEmployeeData, EmployeeModel);
        expect(validCustomers).toBeDefined();
        expect(validCustomers['status']).toBe(updateEmployeeData['status']);
    });

    it('should return employee validation error', async () => {
        const invalidEmployee = await EmployeeInterlayer.postEmployees({ email: 'as' }, EmployeeModel);
        expect(invalidEmployee).toBeUndefined();
    });
});
