import { Router, Request, Response, RequestHandler } from 'express';
import { auth } from '../middleware/authMiddleware';
import { Result, validationResult } from 'express-validator';
import OrderModel, { Order } from '../models/order';
import RoomModel from '../models/room';
import daoRoom from '../interlayers/room.interlayer';
import daoOrder from '../interlayers/order.interlayer';
import OrderCartModel, { OrderCart } from '../models/ordersCart';

const router = Router();

router.get(
    '/rooms',
    async (req: Request, res: Response): Promise<Response> => {
        const rooms = await daoRoom.getAllRoom(RoomModel);
        return res.json({ rooms });
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
            const rooms = await RoomModel.find();
            const filteredRooms = rooms.filter(item => {
                return item.isBooked !== true && item.category === req.body.category;
            });
            if (filteredRooms.length === 0) {
                return res.status(400).json({ message: 'All rooms are booked' });
            } else {
                const notBookedRoomId = filteredRooms[0]._id;
                await RoomModel.findByIdAndUpdate(notBookedRoomId, { isBooked: true }, { new: true });
            }
            const orders = await daoOrder.postOrders(req, OrderModel);
            const userOrder: Order[] | null = await OrderModel.find({ owner: req.user.userId });
            if (userOrder) {
                userOrder.map(async order => {
                    const orderCartItem = new OrderCartModel({
                        status: order.status,
                        orderId: order._id,
                        category: order.category,
                        checkIn: order.checkIn,
                        checkOut: order.checkOut,
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
    async (req: any, res: Response): Promise<void> => {
        const userOrder: Order | null = await OrderModel.findByIdAndRemove(req.body._id);
        console.log(userOrder)
        if (userOrder) {
            const orderCartItem = await OrderCartModel.findOneAndUpdate(
                { orderId: userOrder._id },
                { status: 'canceled' },
            );
            const rooms = await RoomModel.find();
            const filteredRooms = rooms.filter(item => {
                return item.isBooked !== false && item.category === userOrder.category;
            });
            if (filteredRooms.length === 0) {
                return;
            } else {
                const updateBookedRoomId = filteredRooms[0]._id;
                await RoomModel.findByIdAndUpdate(updateBookedRoomId, { isBooked: false }, { new: true });
            }
        }
    },
);

router.get(
    '/order',
    auth,
    async (req: any, res: Response): Promise<any> => {
        const orders = await OrderModel.find({ owner: req.user.userId });
        return res.json({ orders });
    },
);

export default router;
