import { Router, Request, Response } from 'express';
import { auth } from '../middleware/authMiddleware';
import { Result, validationResult } from 'express-validator';
import OrderModel, { Order } from '../models/order';
import RoomModel, { RoomInt } from '../models/room';
import daoRoom from '../interlayers/room.interlayer';
import OrderCartModel, { OrderCart } from '../models/ordersCart';
import OrderInterlayer from '../interlayers/order.interlayer';
import RoomInterlayer from '../interlayers/room.interlayer';
import CustomerModel, { Customer } from '../models/customer';
import CustomerInterlayer from '../interlayers/customer.interlayer';
import FeedbackModel, { Feedback } from '../models/feedback';
import FeedbackInterlayer from '../interlayers/feedback.interlayer';

const router = Router();

router.get(
    '/rooms',
    async (req: Request, res: Response): Promise<Response> => {
        const rooms: RoomInt[] = await daoRoom.getAllRoom(RoomModel);
        return res.json({ rooms });
    },
);

router.get(
    '/orderHistory',
    auth,
    async (req: any, res: Response): Promise<Response> => {
        const customer: Customer[] = await CustomerModel.find({ _id: req.user.userId });
        const ordercarts: OrderCart[] = await OrderInterlayer.getOrdersByParam(customer[0], OrderCartModel);
        return res.json({ ordercarts });
    },
);

router.post(
    '/order',
    auth,
    async (req: any, res: Response): Promise<Response> => {
        try {
            const errors: Result = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array(), message: 'Incorrect data, please try again' });
            }
            const allOrders: OrderCart[] = await OrderCartModel.find();
            const filteredOrders: OrderCart[] = allOrders.filter(order => {
                return (
                    order.category === req.body.category &&
                    Date.parse(order.checkOut) > Date.parse(req.body.checkIn) &&
                    order.status === 'booked'
                );
            });
            if (filteredOrders.length !== 0) {
                return res.status(400).json({ message: 'All rooms are booked' });
            }
            const orders: Order = await OrderInterlayer.postOrders(req, OrderModel);
            const userOrder: Order[] | null = await OrderModel.find({ owner: req.user.userId });
            if (userOrder) {
                userOrder.map(async order => {
                    const orderCartItem = new OrderCartModel({
                        status: order.status,
                        orderId: order._id,
                        category: order.category,
                        checkIn: order.checkIn,
                        checkOut: order.checkOut,
                        price: order.price,
                        userEmail: order.userEmail,
                    });
                    await orderCartItem.save();
                });
            }
            return res.status(201).json({ message: 'Order was created', orders });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: e });
        }
    },
);

router.delete(
    '/order/delete',
    async (req: Request, res: Response): Promise<any> => {
        const userOrder: Order | null = await OrderInterlayer.deleteOrder(req.body, OrderModel);
        if (userOrder) {
            await OrderCartModel.findOneAndUpdate({ orderId: userOrder._id }, { status: 'canceled' });
            return res.json({ message: 'Order was deleted' });
        }
    },
);

router.get(
    '/order',
    auth,
    async (req: any, res: Response): Promise<Response> => {
        const orders: Order[] = await OrderInterlayer.getUserOrders(req, OrderModel);
        return res.json({ orders });
    },
);

router.get(
    '/rooms/:id',
    async (req: Request, res: Response): Promise<Response> => {
        const rooms: RoomInt[] | null = await RoomInterlayer.getOneRoom(req, RoomModel);
        return res.json({ rooms });
    },
);

router.get(
    '/customer',
    auth,
    async (req: Request, res: Response): Promise<Response> => {
        const customer: Customer[] | null = await CustomerInterlayer.getOneCustomer(req, CustomerModel);
        return res.json(customer[0]);
    },
);

router.put(
    '/customer/update',
    auth,
    async (req: Request, res: Response): Promise<Response> => {
        const customer: Customer[] | null = await CustomerInterlayer.updateCustomer(req.body, CustomerModel);
        console.log(customer);
        return res.json({ customer, message: 'Info successfully updated' });
    },
);

router.post(
    '/feedback/add',
    async (req: Request, res: Response): Promise<Response> => {
        console.log(req.body);
        const feedback: Feedback | null = await FeedbackInterlayer.postFeedback(req, FeedbackModel);
        return res.json({ feedback, message: 'Feedback successfully saved' });
    },
);

export default router;
