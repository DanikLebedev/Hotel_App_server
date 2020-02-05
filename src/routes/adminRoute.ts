import { Router, Request, Response } from 'express';
import Category, { CategoryInt } from '../models/category';
import { check, Result, validationResult } from 'express-validator';
import { auth } from '../middleware/authMiddleware';
import Room, { RoomInt } from '../models/room';
import EmployeeModel, { EmployeeI } from '../models/employee';
import StatusModel, { StatusInt } from '../models/status';
import daoCategory from '../interlayers/category.interlayer';
import daoRoom from '../interlayers/room.interlayer';
import { DbServices } from '../db/dbServices';
import daoEmployee from '../interlayers/employee.interlayer';
import daoStatus from '../interlayers/status.interlayer';
import daoCustomer from '../interlayers/customer.interlayer';
import CustomerModel from '../models/customer';

const router: Router = Router();

router.get(
    '/customers',
    async (req: Request, res: Response): Promise<Response> => {
        const customers = await daoCustomer.getAllCustomers(CustomerModel);
        return res.json({ customers });
    },
);

router.post(
    '/login',
    [
        check('email', 'Incorrect email').isEmail(),
        check('password', "Minimal password's length is 6").isLength({ min: 6 }),
    ],
    async (req: Request, res: Response): Promise<void> => {
        await DbServices.loginUser(req, res, EmployeeModel);
    },
);

router.post(
    '/category',
    check('title', 'Incorrect title').isString(),
    async (req: Request, res: Response): Promise<Response> => {
        const errors: Result = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array(), message: 'Incorrect data, please try again' });
        }
        const candidate: CategoryInt | null = await Category.findOne({ title: req.body.title });
        if (candidate) {
            return res.status(400).json({
                message: 'Тhis category is already created',
            });
        }
        const categories: CategoryInt = await daoCategory.postCategories(req.body, Category);
        return res.status(201).json({ message: 'Category was created', categories });
    },
);

router.get(
    '/category',
    async (req: Request, res: Response): Promise<Response> => {
        const categories: void = await daoCategory.getAllCategories(Category);
        return res.json({ categories });
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
    [
        check('category', 'Incorrect category title').isString(),
        check('price', 'Incorrect price').isInt(),
        check('area', 'Incorrect area').isInt(),
        check('guests', 'Incorrect number of guests').isInt({ min: 1 }),
        check('rooms', 'Incorrect number of rooms').isInt({ min: 1 }),
        check('description', 'Incorrect description').isString(),
    ],
    async (req: Request, res: Response): Promise<Response> => {
        const errors: Result = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array(), message: 'Incorrect data, please try again' });
        }
        try {
            const rooms: RoomInt = await daoRoom.postRooms(req, Room);
            return res.status(201).json({ message: 'Room was created', rooms: rooms });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: e });
        }
    },
);

router.get(
    '/room',
    async (req: Request, res: Response): Promise<Response> => {
        const rooms: void = await daoRoom.getAllRoom(Room);
        return res.json({ rooms });
    },
);

router.delete(
    '/room',
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
    [
        check('email', 'Incorrect email').isEmail(),
        check('password', "Minimal password's length is 6").isLength({ min: 6 }),
    ],
    async (req: Request, res: Response): Promise<Response> => {
        try {
            const errors: Result = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array(), message: 'Incorrect data, please try again' });
            }
            const candidate: EmployeeI | null = await EmployeeModel.findOne({ email: req.body.email });
            if (candidate) {
                return res.status(400).json({
                    message: 'Тhis email is already used',
                });
            }
            const employee: EmployeeI = await daoEmployee.postEmployees(req.body, EmployeeModel);
            return res.status(201).json({ message: 'User was created', employee });
        } catch (e) {
            return res.json({ message: 'Incorrect data' });
        }
    },
);

router.get(
    '/employee',
    async (req: Request, res: Response): Promise<Response> => {
        const employee = await daoEmployee.getAllEmployees(EmployeeModel);
        return res.json({ employee });
    },
);

router.delete(
    '/employee/:id',
    async (req: Request, res: Response): Promise<void> => {
        const employee = await EmployeeModel.findByIdAndRemove(req.params.id);
    },
);

router.post(
    '/status',
    async (req: Request, res: Response): Promise<Response> => {
        const errors: Result = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array(), message: 'Incorrect data, please try again' });
        }
        const statuses: StatusInt = await daoStatus.postStatus(req.body, StatusModel);
        return res.status(201).json({ message: 'status was created', statuses });
    },
);
router.get(
    '/status',
    async (req: Request, res: Response): Promise<Response> => {
        const statuses = await daoStatus.getAllStatuses(StatusModel);
        return res.json({ statuses });
    },
);

export default router;
