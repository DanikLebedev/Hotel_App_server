import { DbServices } from '../db/dbServices';
import router from '../routes/adminRoute';
import CategoryModel from '../models/category';

describe('testing DbServices', () => {
    it('should be defined', () => {
        expect(DbServices).toBeDefined();
    });
    it('should return array of objects', function() {});
});
