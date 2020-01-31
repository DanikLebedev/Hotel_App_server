import { DbServices } from '../db/dbServices';

export default class DaoCategory {
    public static async getAllCategories(req, res, Model) {
        await DbServices.getData(req, res, Model);
    }
    public static async postCategories(req, res, Model) {
        await DbServices.postData(req, res, Model)
    }
}
