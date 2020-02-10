import { DbServices } from '../db/dbServices';
import { Order } from '../models/order';

export default class OrderInterlayer {
    public static async getAllOrders(Model): Promise<Order[]> {
        return await DbServices.getData(Model);
    }
    public static async postOrders(req, Model) {
        req.body.owner = req.user.userId;
        return await DbServices.postData(req.body, Model);
    }

    public static async deleteOrder(body, Model) {
        return await DbServices.deleteData(body, Model);
    }
}
