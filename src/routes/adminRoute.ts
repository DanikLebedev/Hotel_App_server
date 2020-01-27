import {Router, Request, Response, } from 'express';
import Category from '../models/category';
import { Result, validationResult } from 'express-validator';
import { auth } from '../middleware/authMiddleware';
import { Document } from 'mongoose';

const router = Router();

interface UserRequest extends Request {
    user: string;
}

export interface Category extends Document {
    title: string;
    price: number;
    bedsQuantity: number;
    area: number;
    description: string;
    image: string;
    count: number;
}

router.post(
    '/createCategory',
    auth,
    async (req: Request, res: Response): Promise<Response> => {
        const errors: Result = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array(), message: 'Incorrect data, please try again' });
        }
        try {
            const { title, price, description, image, bedsQuantity, area }: Category = req.body;
            let { count } = req.body;

            const candidate: Category | null = await Category.findOne({ title });

            const category: Category = new Category({
                title,
                price,
                description,
                image,
                bedsQuantity,
                area,
                owner: req['user'].userId,
                count,
            });

            await category.save();

            // if (candidate) {
            //     await Category.findByIdAndUpdate(category._id, { count: count++ });
            // }
            return res.status(201).json({ category });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: 'something wrong happen...' });
        }
    },
);

export default router;
