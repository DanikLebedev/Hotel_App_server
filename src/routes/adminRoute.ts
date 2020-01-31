import { Router, Request, Response } from 'express';
import Category from '../models/category';
import { check } from 'express-validator';
import { auth } from '../middleware/authMiddleware';
import { Document } from 'mongoose';
import Room from '../models/room';
import Employee from '../models/employee';
import StatusModel from '../models/status';
import daoCategory from '../dao/daoCategory';
import daoRoom from '../dao/daoRoom';
import { DbServices } from '../db/dbServices';
import daoEmployee from '../dao/daoEmployee';
import daoStatus from '../dao/daoStatus';

const router: Router = Router();

export interface AuthData extends Document {
    email: string;
    password: string;
}

router.post(
    '/login',
    [
        check('email', 'Incorrect email').isEmail(),
        check('password', "Minimal password's length is 6").isLength({ min: 6 }),
    ],
    async (req: Request, res: Response): Promise<void> => {
        await DbServices.loginUser(req, res, Employee);
    },
);

router.post(
    '/category',
    async (req: Request, res: Response): Promise<void> => {
        await daoCategory.postCategories(req, res, Category);
    },
);

router.get(
    '/category',
    async (req: Request, res: Response): Promise<void> => {
        await daoCategory.getAllCategories(req, res, Category);
    },
);

router.delete(
    '/category',
    async (req: Request, res: Response): Promise<void> => {
        try {
            const categories = await Category.findOneAndDelete({ title: req.body.title });
            res.json(categories);
        } catch (e) {
            console.log(e);
        }
    },
);

router.post(
    '/room',
    async (req: Request, res: Response): Promise<void> => {
        await daoRoom.postRooms(req, res, Room);
    },
);

router.get(
    '/room',
    async (req: Request, res: Response): Promise<void> => {
        await daoRoom.getAllRoom(req, res, Room);
    },
);

router.delete(
    '/room/',
    async (req: Request, res: Response): Promise<void> => {
        try {
            const rooms = await Room.findByIdAndRemove(req.params.id);
            res.json(rooms);
        } catch (e) {
            console.log(e);
        }
    },
);

router.post(
    '/employee',
    async (req: Request, res: Response): Promise<void> => {
        await daoEmployee.postEmployees(req, res, Employee);
    },
);

router.get(
    '/employee',
    async (req: Request, res: Response): Promise<void> => {
        await daoEmployee.getAllEmployees(req, res, Employee);
    },
);

router.delete(
    '/employee/:id',
    async (req: Request, res: Response): Promise<void> => {
        try {
            const employee = await Employee.findByIdAndRemove(req.params.id);
            res.json(employee);
        } catch (e) {
            console.log(e);
        }
    },
);

router.post(
    '/status',
    async (req: Request, res: Response): Promise<void> => {
        await daoStatus.postStatus(req, res, StatusModel);
    },
);
router.get(
    '/status',
    async (req: Request, res: Response): Promise<void> => {
        await daoStatus.getAllStatuses(req, res, StatusModel);
    },
);

export default router;
