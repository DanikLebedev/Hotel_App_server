import mongoose from 'mongoose';
import keys from '../../keys/keys';
import daoStatus from '../controllers/status.controller';
import StatusModel from '../models/status';

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
    it('should get all statuses', async () => {
        const validStatuses = await daoStatus.getAllStatuses(StatusModel);
        expect(validStatuses).toBeDefined();
        expect(validStatuses[0].title).toBeDefined();
    });

    it('should create new status', async () => {
        const validStatuses = await daoStatus.postStatus({ title: 'searcher' }, StatusModel);
        expect(validStatuses).toBeDefined();
        expect(validStatuses['title']).toBe('searcher');
    });
});
