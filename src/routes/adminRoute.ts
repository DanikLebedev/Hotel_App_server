import { Router, Request, Response } from 'express';
import Category from '../models/category';
import { Result, validationResult } from 'express-validator';
import { auth } from '../middleware/authMiddleware';
import { Document } from 'mongoose';
import Room from '../models/room';
import Employee from '../models/employee';

const router = Router();

export interface Category extends Document {
    title: string;
}

router.post(
    '/category',
    async (req: Request, res: Response): Promise<Response> => {
        const errors: Result = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array(), message: 'Incorrect data, please try again' });
        }
        try {
            const { title }: Category = req.body;

            const candidate: Category | null = await Category.findOne({ title });

            const category: Category = new Category({
                title,
            });

            if (candidate) {
                return res.status(400).json({
                    message: 'Тhis category is already used',
                });
            }

            await category.save();

            return res.status(201).json({ category });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: 'something wrong happen...' });
        }
    },
);

router.get('/category', async (req: Request, res: Response) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (e) {
        console.log(e);
    }
});

router.post(
    '/room',
    async (req: Request, res: Response): Promise<Response> => {
        const errors: Result = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array(), message: 'Incorrect data, please try again' });
        }
        try {
            const { title, price, area, guests, rooms, description, image, category } = req.body;

            const room = new Room({
                title,
                price,
                area,
                guests,
                rooms,
                description,
                image,
                category,
            });

            await room.save();

            return res.status(201).json({ room });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: 'something wrong happen...' });
        }
    },
);

router.get('/room', async (req: Request, res: Response) => {
    try {
        const rooms = await Category.find();
        res.json(rooms);
    } catch (e) {
        console.log(e);
    }
});

router.post(
    '/employee',
    async (req: Request, res: Response): Promise<Response> => {
        const errors: Result = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array(), message: 'Incorrect data, please try again' });
        }
        try {
            const { email, password } = req.body;

            const employee = new Employee({
                email,
                password,
                status: 'manager',
            });

            await employee.save();

            return res.json({ employee });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: 'something wrong happen...' });
        }
    },
);

export default router;
