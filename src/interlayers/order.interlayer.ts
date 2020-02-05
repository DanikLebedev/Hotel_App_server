import { DbServices } from '../db/dbServices';

export default class OrderInterlayer {
    public static async getAllOrders(req, res, Model) {
        await DbServices.getData(Model);
    }
    public static async postOrders(body, Model) {
        await DbServices.postData(body, Model);
    }
}
