import mongoose from 'mongoose';
import keys from '../../keys/keys';
import daoEmployee from '../controllers/employee.controller';
import EmployeeModel from '../models/employee';

const employeeData = {
    email: 'dada@mail.ru',
    password: '123123',
    status: 'manager',
};

describe('All Models Testing', () => {
    beforeAll(async () => {
        await mongoose.connect(
            keys.MONGODB_URI,
            { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
            err => {
                if (err) {
                    console.error(err);
                    process.exit(1);
                }
            },
        );
    });
    it('should get all employee', async () => {
        const validEmployee = await daoEmployee.getAllEmployees(EmployeeModel);
        expect(validEmployee).toBeDefined();
        expect(validEmployee[0].email).toBeDefined();
    });

    it('should create new employee', async () => {
        const validEmployee = await daoEmployee.postEmployees(employeeData, EmployeeModel);
        expect(validEmployee).toBeDefined();
        expect(validEmployee['email']).toBe(employeeData['email']);
    });

    it('should return employee validation error', async () => {
        const invalidEmployee = await daoEmployee.postEmployees({ email: 'as' }, EmployeeModel);
        expect(invalidEmployee).toBeUndefined();
    });
});
