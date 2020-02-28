import mongoose from 'mongoose';
import keys from '../../keys/keys';
import CategoryInterlayer from '../interlayers/category.interlayer';
import CategoryModel from '../models/category';

const categoryData = { title: 'Luxury' };
const updateCategoryData = { title: 'President +', _id: '5e46c987e31343083c53888b' };
const deleteData = { _id: '5e58d4fe75d8954fb872aa2e' };

describe('Category model testing', () => {
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
    it('should get all categories', async () => {
        const validCategory = await CategoryInterlayer.getAllCategories(CategoryModel);
        expect(validCategory).toBeDefined();
        expect(typeof validCategory[0].title).toBe('string');
    });

    it('should create new category', async () => {
        const validCategory = await CategoryInterlayer.postCategories(categoryData, CategoryModel);
        expect(validCategory).toBeDefined();
        expect(validCategory['title']).toBe(categoryData.title);
    });

    it('should delete category', async () => {
        const validCategory = await CategoryInterlayer.deleteCategories(deleteData, CategoryModel);
        expect(validCategory).toBeDefined();
        expect(validCategory['title']).toBe(categoryData.title);
    });

    it('should update category', async () => {
        const validCategory = await CategoryInterlayer.updateCategories(updateCategoryData, CategoryModel);
        expect(validCategory).toBeDefined();
        expect(validCategory['title']).toBe(updateCategoryData.title);
    });

    it('should return category validation error', async () => {
        const invalidCategory = await CategoryInterlayer.postCategories({ title: '' }, CategoryModel);
        expect(invalidCategory).toBeUndefined();
    });
});
