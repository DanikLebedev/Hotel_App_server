import keys from '../../keys/keys';
import mongoose from 'mongoose';
import CategoryModel from '../models/category';
import daoCategory from '../dao/daoCategory';
const category = { title: 'Luxury' };

describe('User Model Test', () => {
    // It's just so easy to connect to the MongoDB Memory Server
    // By using mongoose.connect
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

    it('create & save user successfully', async () => {
        // @ts-ignore
        const validCategory: { _id: string; title: string } = await daoCategory.getAllCategories(CategoryModel);
        // Object Id should be defined when successfully saved to MongoDB.
        expect(validCategory).toBeDefined();
        expect(typeof validCategory[0].title).toBe('string');
    });

    // Test Schema is working!!!
    // You shouldn't be able to add in any field that isn't defined in the schema
    // it('insert user successfully, but the field does not defined in schema should be undefined', async () => {
    //     const userWithInvalidField = new UserModel({ name: 'TekLoon', gender: 'Male', nickname: 'Handsome TekLoon' });
    //     const savedUserWithInvalidField = await userWithInvalidField.save();
    //     expect(savedUserWithInvalidField._id).toBeDefined();
    //     expect(savedUserWithInvalidField.nickkname).toBeUndefined();
    // });
    //
    // // Test Validation is working!!!
    // // It should us told us the errors in on gender field.
    // it('create user without required field should failed', async () => {
    //     const userWithoutRequiredField = new UserModel({ name: 'TekLoon' });
    //     let err;
    //     try {
    //         const savedUserWithoutRequiredField = await userWithoutRequiredField.save();
    //         error = savedUserWithoutRequiredField;
    //     } catch (error) {
    //         err = error;
    //     }
    //     expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    //     expect(err.errors.gender).toBeDefined();
    // });
});
