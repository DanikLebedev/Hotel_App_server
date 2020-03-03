import { DbServices } from '../db/dbServices';
import { Order } from '../models/order';
import { OrderCart } from '../models/ordersCart';
import { model } from 'mongoose';

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

    public static async getOrdersByParam(body, Model): Promise<OrderCart[]> {
        const param = { userEmail: body.email };
        return await DbServices.getDataByParam(param, Model);
    }

    public static async getUserOrders(req, Model): Promise<Order[]> {
        const param = { owner: req.user.userId };
        return await DbServices.getDataByParam(param, Model);
    }

    public static async updateAdminOrder(body, Model): Promise<OrderCart> {
        return await DbServices.updateData(body, Model);
    }
}
