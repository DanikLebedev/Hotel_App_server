import { DbServices } from '../db/dbServices';

export default class DaoOrder {
    public static async getAllOrders(req, res, Model) {
        await DbServices.getData(req, res, Model);
    }
    public static async postOrders(req, res, Model) {
        await DbServices.postData(req, res, Model)
    }
}
