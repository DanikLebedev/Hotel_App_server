import { DbServices } from '../db/dbServices';

export default class CategoryContoller {
    public static async getAllCategories(Model): Promise<void> {
        return await DbServices.getData(Model);
    }
    public static async postCategories(body, Model) {
        return await DbServices.postData(body, Model);
    }
}
