import { Router, Request, Response, RequestHandler } from 'express';
import { auth } from '../middleware/authMiddleware';
import { Result, validationResult } from 'express-validator';
import OrderModel, { Order } from '../models/order';
import RoomModel, { RoomInt } from '../models/room';
import daoRoom from '../interlayers/room.interlayer';
import daoOrder from '../interlayers/order.interlayer';
import OrderCartModel from '../models/ordersCart';
import OrderInterlayer from '../interlayers/order.interlayer';
import RoomInterlayer from '../interlayers/room.interlayer';

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
                        price: order.price,
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
            const rooms: RoomInt[] = await RoomModel.find();
            const filteredRooms: RoomInt[] = rooms.filter(item => {
                return item.isBooked && item.category === userOrder.category;
            });
            if (filteredRooms.length === 0) {
                return res.json({ message: 'Order was deleted' });
            } else {
                const updateBookedRoomId: string = filteredRooms[0]._id;
                await RoomModel.findByIdAndUpdate(updateBookedRoomId, { isBooked: false }, { new: true });
                return res.json({ message: 'Order was deleted' });
            }
        }
    },
);

router.get(
    '/order',
    auth,
    async (req: any, res: Response): Promise<Response> => {
        const orders: Order[] = await OrderInterlayer.getOneOrder(req, OrderModel);
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

export default router;
