import keys from '../../keys/keys';
import mongoose from 'mongoose';
import daoCustomer from '../interlayers/customer.interlayer';
import CustomerModel from '../models/customer';

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

    it('should get all customers', async () => {
        const validCustomers = await daoCustomer.getAllCustomers(CustomerModel);
        expect(validCustomers).toBeDefined();
        expect(validCustomers[0].email).toBeDefined();
    });

    it('should create new customer', async () => {
        const validCustomers = await daoCustomer.postCustomers(
            { email: 'dadadad@mail.ru', password: '12312312' },
            CustomerModel,
        );
        expect(validCustomers).toBeDefined();
        expect(validCustomers.email).toBe('dadadad@mail.ru');
    });
});
