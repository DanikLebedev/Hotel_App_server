import mongoose from 'mongoose';
import keys from '../../keys/keys';
import daoCategory from '../interlayers/category.interlayer';
import CategoryModel from '../models/category';


const categoryData = { title: 'Luxury' };

describe('Category model testing', () => {
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
    it('should get all categories', async () => {
        const validCategory = await daoCategory.getAllCategories(CategoryModel);
        expect(validCategory).toBeDefined();
        expect(typeof validCategory[0].title).toBe('string');
    });

    it('should create new category', async () => {
        const validCategory = await daoCategory.postCategories(categoryData, CategoryModel);
        expect(validCategory).toBeDefined();
        expect(validCategory['title']).toBe(categoryData.title);
    });

    it('should return category validation error', async () => {
        const invalidCategory = await daoCategory.postCategories({ title: '' }, CategoryModel);
        expect(invalidCategory).toBeUndefined();
    });
});
