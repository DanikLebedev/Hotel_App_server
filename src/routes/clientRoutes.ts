import { Router, Request, Response } from 'express';
import { auth } from '../middleware/authMiddleware';
import { check, Result, ValidationError, validationResult } from 'express-validator';
import OrderModel from '../models/order';
import RoomModel from '../models/room';
import { DbServices } from '../db/dbServices';
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

            await RoomModel.findOneAndUpdate(category, { isBooked: true });

            // const candidate = await OrderModel.findOne({ customerId });

            const order = new OrderModel({
                customerId,
                category,
                checkIn,
                checkOut,
                guests,
            });

            // if (candidate) {
            //     return res.status(400).json({
            //         message: 'Тhis room is already used',
            //     });
            // }

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
