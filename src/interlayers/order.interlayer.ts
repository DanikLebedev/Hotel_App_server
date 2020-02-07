import { DbServices } from '../db/dbServices';

export default class OrderInterlayer {
    public static async getAllOrders(Model): Promise<void> {
        return await DbServices.getData(Model);
    }
    public static async postOrders(req, Model) {
        req.body.owner = req.user.userId;
        return await DbServices.postData(req.body, Model);
    }
}
