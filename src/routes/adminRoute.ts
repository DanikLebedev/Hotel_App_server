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
import FeedbackModel, { Feedback } from '../models/feedback';
import FeedbackInterlayer from '../interlayers/feedback.interlayer';
import { isAdmin } from '../middleware/adminMiddleware';
import ArticleModel, { ArticleInt } from '../models/article';
import ArticleInterlayer from '../interlayers/article.interlayer';

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
    auth,
    isAdmin,
    check('title', 'Incorrect title').isString(),
    async (req: Request, res: Response, next): Promise<Response> => {
        const errors: Result = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array(), message: 'Incorrect data, please try again' });
        }
        try {
            const candidate: CategoryInt | null = await Category.findOne({ title: req.body.title });
            if (candidate) {
                return res.status(400).json({
                    message: 'Тhis category is already created',
                });
            }
            const categories: CategoryInt = await CategoryInterlayer.postCategories(req.body, Category);
            return res.json({ message: 'Category was created', categories });
        } catch (e) {
            return res.json({ message: 'Something wrong happened' });
        }
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
    auth,
    isAdmin,
    async (req: Request, res: Response): Promise<Response> => {
        try {
            const category: CategoryInt = await CategoryInterlayer.deleteCategories(req.body, Category);
            return res.json({ message: 'Category was deleted', category });
        } catch (e) {
            return res.json({ message: 'Something wrong happened' });
        }
    },
);

router.put(
    '/category/update',
    auth,
    isAdmin,
    async (req: Request, res: Response): Promise<Response> => {
        try {
            const category: CategoryInt | null = await CategoryInterlayer.updateCategories(req.body, Category);
            return res.json({ category, message: 'Category was updated' });
        } catch (e) {
            return res.json({ message: 'Something wrong happened' });
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
            const rooms: RoomInt = await RoomInterlayer.postRooms(req, Room);
            return res.status(201).json({ message: 'Room was created', rooms: rooms });
        } catch (e) {
            return res.json({ message: 'Something wrong happened' });
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
    auth,
    isAdmin,
    async (req: Request, res: Response): Promise<Response> => {
        try {
            const room: RoomInt | null = await RoomInterlayer.deleteRoom(req.body, Room);
            return res.json({ room, message: 'Room was deleted' });
        } catch (e) {
            return res.json({ message: 'Something wrong happened' });
        }
    },
);

router.put(
    '/room/update',
    auth,
    isAdmin,
    async (req: Request, res: Response): Promise<Response> => {
        try {
            const rooms: RoomInt | null = await RoomInterlayer.updateRoom(req, Room);
            return res.json({ rooms, message: 'Room was updated' });
        } catch (e) {
            return res.json({ message: 'Something wrong happened' });
        }
    },
);

router.post(
    '/employee',
    auth,
    isAdmin,
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
            return res.json({ message: 'User was created', employee });
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
    auth,
    isAdmin,
    async (req: Request, res: Response): Promise<Response> => {
        try {
            const employee: EmployeeI | null = await EmployeeInterlayer.deleteEmployee(req.body, EmployeeModel);
            return res.json({ employee, message: 'Employee was deleted' });
        } catch (e) {
            return res.json({ message: 'Something wrong happened' });
        }
    },
);

router.put(
    '/employee/update',
    auth,
    isAdmin,
    async (req: Request, res: Response): Promise<Response> => {
        try {
            const employee: EmployeeI | null = await EmployeeInterlayer.updateEmployee(req.body, EmployeeModel);
            return res.json({ employee, message: 'Employee was updated' });
        } catch (e) {
            return res.json({ message: 'Something wrong happened' });
        }
    },
);

router.post(
    '/status',
    auth,
    isAdmin,
    async (req: Request, res: Response): Promise<Response> => {
        const errors: Result = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array(), message: 'Incorrect data, please try again' });
        }
        try {
            const statuses: StatusInt = await StatusInterlayer.postStatus(req.body, StatusModel);
            return res.status(201).json({ message: 'status was created', statuses });
        } catch (e) {
            return res.json({ message: 'Something wrong happened' });
        }
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
    async (req: Request, res: Response): Promise<Response> => {
        const ordercarts: OrderCart[] = await OrderInterlayer.getAllOrders(OrderCartModel);
        return res.json({ ordercarts });
    },
);

router.post(
    '/orders/create',
    [
        check('category', 'Incorrect category title').isString(),
        check('price', 'Incorrect price').isInt(),
        check('userEmail', 'Incorrect user email').isString(),
        check('checkIn', 'Incorrect checkIn date'),
        check('checkOut', 'Incorrect checkOut date'),
    ],
    auth,
    isAdmin,
    async (req: Request, res: Response): Promise<Response> => {
        try {
            const user: Customer | null = await CustomerModel.findOne({ email: req.body.userEmail });
            if (!user) {
                return res.json({ message: 'Invalid user email' });
            }
            if (user) {
                req.body.userId = user._id;
            }
            const ordercarts: OrderCart = await OrderInterlayer.postAdminOrders(req, OrderCartModel);
            return res.json({ ordercarts, message: 'Order was created' });
        } catch (e) {
            return res.json({ message: 'Something wrong happened' });
        }
    },
);

router.put(
    '/orders/update',
    auth,
    isAdmin,
    async (req: Request, res: Response): Promise<Response> => {
        try {
            const order: OrderCart | null = await OrderInterlayer.updateAdminOrder(req.body, OrderCartModel);
            return res.json({ order, message: 'Order was updated' });
        } catch (e) {
            return res.json({ message: 'Something wrong happened' });
        }
    },
);

router.delete(
    '/orders/delete',
    async (req: Request, res: Response): Promise<Response> => {
        try {
            const orders: OrderCart | null = await OrderInterlayer.deleteOrder(req.body, OrderCartModel);
            return res.json({ orders, message: 'Order was deleted' });
        } catch (e) {
            return res.json({ message: 'Something wrong happened' });
        }
    },
);

router.get(
    '/feedbacks',
    async (req: Request, res: Response): Promise<Response> => {
        const feedbacks: Feedback[] = await FeedbackInterlayer.getAllFeedbacks(FeedbackModel);
        return res.json({ feedbacks });
    },
);

router.put(
    '/feedbacks/update',
    auth,
    isAdmin,
    async (req: Request, res: Response): Promise<Response> => {
        try {
            const feedback: Feedback | null = await FeedbackInterlayer.updateFeedback(req.body, FeedbackModel);
            return res.json({ feedback, message: 'Feedback was updated' });
        } catch (e) {
            return res.json({ message: 'Something wrong happened' });
        }
    },
);

router.delete(
    '/feedbacks/delete',
    auth,
    isAdmin,
    async (req: Request, res: Response): Promise<Response> => {
        try {
            const feedback: Feedback | null = await FeedbackInterlayer.deleteFeedback(req.body, FeedbackModel);
            return res.json({ feedback, message: 'Feedback was deleted' });
        } catch (e) {
            return res.json({ message: 'Something wrong happened' });
        }
    },
);

router.post(
    '/articles/create',
    [
        check('title', 'Incorrect article title').isString(),
        check('text', 'Incorrect article text').isString(),
    ],
    auth,
    isAdmin,
    async (req: Request, res: Response): Promise<Response> => {
        try {
            const article: ArticleInt | null = await ArticleInterlayer.postArticle(req, ArticleModel);
            return res.json({ article, message: 'Article was created' });
        } catch (e) {
            return res.json({ message: 'Something wrong happened' });
        }
    },
);

router.get(
    '/articles',
    async (req: Request, res: Response): Promise<Response> => {
        const article: ArticleInt[] | null = await ArticleInterlayer.getAllArticles(ArticleModel);
        return res.json({ article });
    },
);

router.put(
    '/articles/update',
    auth,
    isAdmin,
    async (req: Request, res: Response): Promise<Response> => {
        try {
            const article: ArticleInt | null = await ArticleInterlayer.updateArticle(req, ArticleModel);
            return res.json({ article, message: 'Article was updated' });
        } catch (e) {
            return res.json({ message: 'Something wrong happened' });
        }
    },
);

router.delete(
    '/articles/delete',
    auth,
    isAdmin,
    async (req: Request, res: Response): Promise<Response> => {
        try {
            const article: ArticleInt | null = await ArticleInterlayer.deleteArticle(req.body, ArticleModel);
            return res.json({ article, message: 'Article was updated' });
        } catch (e) {
            return res.json({ message: 'Something wrong happened' });
        }
    },
);

export default router;
