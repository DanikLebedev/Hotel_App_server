import { DbServices } from '../db/dbServices';
import router from '../routes/adminRoute';
import CategoryModel from '../models/category';

describe('get category', () => {
    it('gets user', () => {
        router.post('/category', async (req, res) => {
            const category = await DbServices.getData(req, res, CategoryModel);
            expect(category[0].title).toBe(123123);
        });
    });
});
