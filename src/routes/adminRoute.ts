import { Router, Request, Response } from 'express';
import Category, { CategoryInt } from '../models/category';
import { check, Result, validationResult } from 'express-validator';
import { auth } from '../middleware/authMiddleware';
import Room, { RoomInt } from '../models/room';
import EmployeeModel, { EmployeeI } from '../models/employee';
import StatusModel, { StatusInt } from '../models/status';
import CategoryInterlayer from '../interlayers/category.interlayer';
import RoomInterlayer from '../interlayers/room.interlayer';
import { DbServices } from '../db/dbServices';
import EmployeeInterlayer from '../interlayers/employee.interlayer';
import CustomerInterlayer from '../interlayers/customer.interlayer';
import CustomerModel from '../models/customer';
import StatusInterlayer from '../interlayers/status.interlayer';
import { Customer } from '../models/customer';
import OrderCartModel, { OrderCart } from '../models/ordersCart';
import OrderInterlayer from '../interlayers/order.interlayer';

const router: Router = Router();

router.get(
    '/customers',
    auth,
    async (req: Request, res: Response): Promise<Response> => {
        const customers: Customer[] = await CustomerInterlayer.getAllCustomers(CustomerModel);
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
        const categories: CategoryInt = await CategoryInterlayer.postCategories(req.body, Category);
        return res.status(201).json({ message: 'Category was created', categories });
    },
);

router.get(
    '/category',
    async (req: Request, res: Response): Promise<Response> => {
        const categories: CategoryInt[] = await CategoryInterlayer.getAllCategories(Category);
        return res.json({ categories });
    },
);

router.delete(
    '/category/delete',
    async (req: Request, res: Response): Promise<Response> => {
        const category: CategoryInt = await CategoryInterlayer.deleteCategories(req.body, Category);

        return res.json({ message: 'Category was deleted', category });
    },
);

router.put(
    '/category/update',
    async (req: Request, res: Response): Promise<Response> => {
        const category: CategoryInt | null = await CategoryInterlayer.updateCategories(req.body, Category);
        return res.json({ category, message: 'Category was updated' });
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
            const rooms: RoomInt = await RoomInterlayer.postRooms(req, Room);
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
        const rooms: RoomInt[] = await RoomInterlayer.getAllRoom(Room);
        return res.json({ rooms });
    },
);

router.delete(
    '/room/delete',
    async (req: Request, res: Response): Promise<Response> => {
        const room: RoomInt | null = await RoomInterlayer.deleteRoom(req.body, Room);
        return res.json({ room, message: 'Room was deleted' });
    },
);

router.put(
    '/room/update',
    async (req: Request, res: Response): Promise<Response> => {
        const rooms: RoomInt | null = await RoomInterlayer.updateRoom(req.body, Room);
        return res.json({ rooms, message: 'Room was updated' });
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
            const employee: EmployeeI = await EmployeeInterlayer.postEmployees(req, EmployeeModel);
            return res.status(201).json({ message: 'User was created', employee });
        } catch (e) {
            return res.json({ message: 'Incorrect data' });
        }
    },
);

router.get(
    '/employee',
    async (req: Request, res: Response): Promise<Response> => {
        const employees: EmployeeI[] = await EmployeeInterlayer.getAllEmployees(EmployeeModel);
        return res.json({ employees });
    },
);

router.delete(
    '/employee/delete',
    async (req: Request, res: Response): Promise<Response> => {
        const employee: EmployeeI | null = await EmployeeInterlayer.deleteEmployee(req.body, EmployeeModel);
        return res.json({ employee, message: 'Employee was deleted' });
    },
);

router.put(
    '/employee/update',
    async (req: Request, res: Response): Promise<Response> => {
        const employee: EmployeeI | null = await EmployeeInterlayer.updateEmployee(req.body, EmployeeModel);
        return res.json({ employee, message: 'Employee was updated' });
    },
);

router.post(
    '/status',
    async (req: Request, res: Response): Promise<Response> => {
        const errors: Result = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array(), message: 'Incorrect data, please try again' });
        }
        const statuses: StatusInt = await StatusInterlayer.postStatus(req.body, StatusModel);
        return res.status(201).json({ message: 'status was created', statuses });
    },
);
router.get(
    '/status',
    async (req: Request, res: Response): Promise<Response> => {
        const statuses: StatusInt[] = await StatusInterlayer.getAllStatuses(StatusModel);
        return res.json({ statuses });
    },
);

router.get(
    '/orders',
    async (req: Request, res: Response): Promise<any> => {
        const orders: OrderCart[] = await OrderInterlayer.getAllOrders(OrderCartModel);
        return res.json({ orders });
    },
);

router.delete(
    '/orders/delete',
    async (req: Request, res: Response): Promise<Response> => {
        const orders: OrderCart | null = await OrderInterlayer.deleteOrder(req.body, OrderCartModel);
        return res.json({ orders, message: 'Order was deleted' });
    },
);

export default router;
