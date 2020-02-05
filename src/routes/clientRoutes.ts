import { Router, Request, Response } from 'express';
import { auth } from '../middleware/authMiddleware';
import { Result, validationResult } from 'express-validator';
import OrderModel from '../models/order';
import RoomModel from '../models/room';
import daoRoom from '../interlayers/room.interlayer';
import daoOrder from '../interlayers/order.interlayer';

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
    async (req: Request, res: Response): Promise<Response> => {
        const errors: Result = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array(), message: 'Incorrect data, please try again' });
        }
        const rooms = await RoomModel.find();
        const filteredRooms = rooms.filter(item => {
            return item.isBooked !== true && item.category === req.body.category;
        });
        if (!filteredRooms) {
            res.status(500).json({ message: 'All rooms are booked' });
        } else {
            const notBookedRoomId = filteredRooms[0]._id;
            await RoomModel.findByIdAndUpdate(notBookedRoomId, { isBooked: true }, { new: true });
        }

        await daoOrder.postOrders(req.body, OrderModel);
        return res.status(201).json({ message: 'Order was created' });
    },
);

router.get(
    '/order',
    async (req: Request, res: Response): Promise<Response> => {
        const orders = await OrderModel.find().populate('customerId');
        return res.json(orders);
    },
);

export default router;
