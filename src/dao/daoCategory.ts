import { DbServices } from '../db/dbServices';

export default class DaoCategory {
    public static async getAllCategories(Model) {
        return await DbServices.getData(Model);
    }
    public static async postCategories(body, Model) {
        return await DbServices.postData(body, Model);
    }
}
