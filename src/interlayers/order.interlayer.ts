import { DbServices } from '../db/dbServices';
import { Order } from '../models/order';
import { OrderCart } from '../models/ordersCart';

export default class OrderInterlayer {
    public static async getAllOrders(Model): Promise<OrderCart[]> {
        return await DbServices.getData(Model);
    }
    public static async postOrders(req, Model): Promise<Order> {
        req.body.owner = req.user.userId;
        return await DbServices.postData(req.body, Model);
    }

    public static async deleteOrder(body, Model): Promise<any> {
        return await DbServices.deleteData(body, Model);
    }

    public static async getOneOrder(req, Model): Promise<Order[]> {
        const param = { owner: req.user.userId };
        return await DbServices.getDataByParam(param, Model);
    }
}
