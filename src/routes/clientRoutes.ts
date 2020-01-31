import { Router, Request, Response } from 'express';
import { auth } from '../middleware/authMiddleware';
import { check, Result, ValidationError, validationResult } from 'express-validator';
import OrderModel from '../models/order';
import RoomModel from '../models/room';
import { DbServices } from '../db/dbServices';
import { log } from 'util';
const router = Router();

router.get(
    '/rooms',
    async (req: any, res: Response): Promise<void> => {
        await DbServices.getData(req, res, RoomModel);
    },
);

router.post(
    '/order',
    async (req: any, res: Response): Promise<Response> => {
        const errors: Result = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array(), message: 'Incorrect data, please try again' });
        }
        try {
            const { customerId, category, checkIn, checkOut, guests } = req.body;
            const rooms = await RoomModel.find();
            const filteredRooms = rooms.filter(item => {
                return item.isBooked !== true && item.category === category;
            });
            if (!filteredRooms) {
                res.status(500).json({ message: 'All rooms are booked' });
            } else {
                const notBookedRoomId = filteredRooms[0]._id;
                await RoomModel.findByIdAndUpdate(notBookedRoomId, { isBooked: true }, { new: true });
            }

            const order = new OrderModel({
                customerId,
                category,
                checkIn,
                checkOut,
                guests,
            });

            await order.save();

            return res.status(201).json({ order });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: 'something wrong happen...' });
        }
    },
);

router.get(
    '/order',
    async (req: any, res: Response): Promise<void> => {
        try {
            const orders = await OrderModel.find().populate('customerId');
            res.json(orders);
        } catch (e) {
            console.log(e);
        }
    },
);

export default router;
