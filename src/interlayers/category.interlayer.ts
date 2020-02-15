import { DbServices } from '../db/dbServices';
import { CategoryInt } from '../models/category';

export default class CategoryInterlayer {
    public static async getAllCategories(Model): Promise<CategoryInt[]> {
        return await DbServices.getData(Model);
    }
    public static async postCategories(body, Model): Promise<CategoryInt> {
        return await DbServices.postData(body, Model);
    }

    public static async deleteCategories(body, Model): Promise<CategoryInt> {
        return await DbServices.deleteData(body, Model);
    }

    public static async updateCategories(body, Model): Promise<CategoryInt> {
        return await DbServices.updateData(body, Model);
    }
}
