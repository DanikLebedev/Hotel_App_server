import { DbServices } from '../db/dbServices';

export default class CategoryInterlayer {
    public static async getAllCategories(Model): Promise<void> {
        return await DbServices.getData(Model);
    }
    public static async postCategories(body, Model): Promise<any> {
        return await DbServices.postData(body, Model);
    }
}
