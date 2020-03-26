import { Router, Request, Response } from 'express';
import { auth } from '../middleware/authMiddleware';
import { Result, validationResult } from 'express-validator';
import OrderModel, { Order } from '../models/order';
import RoomModel, { RoomInt } from '../models/room';
import daoRoom from '../interlayers/room.interlayer';
import OrderCartModel, { OrderCart } from '../models/ordersCart';
import OrderInterlayer from '../interlayers/order.interlayer';
import RoomInterlayer from '../interlayers/room.interlayer';
import CustomerModel, { Customer } from '../models/customer';
import CustomerInterlayer from '../interlayers/customer.interlayer';
import FeedbackModel, { Feedback } from '../models/feedback';
import FeedbackInterlayer from '../interlayers/feedback.interlayer';
import ArticleModel, { ArticleInt } from '../models/article';
import ArticleInterlayer from '../interlayers/article.interlayer';
import crypto from 'crypto';
import mailgunService from 'mailgun-js';
import keys from '../../keys/keys';
import reset from '../reset';
import bcrypt from 'bcryptjs';
import CommentModel, { CommentInt } from '../models/comment';
import CommentInterlayer from '../interlayers/comment.interlayer';

const mailgun = mailgunService({ apiKey: keys.MAILGUN_API_KEY, domain: keys.MAILGUN_DOMAIN });

const router = Router();

router.get(
    '/rooms',
    async (req: Request, res: Response): Promise<Response> => {
        const rooms: RoomInt[] = await daoRoom.getAllRoom(RoomModel);
        return res.json({ rooms });
    },
);

router.get(
    '/orderHistory',
    auth,
    async (req: any, res: Response): Promise<Response> => {
        const customer: Customer[] = await CustomerModel.find({ _id: req.user.userId });
        const ordercarts: OrderCart[] = await OrderInterlayer.getOrdersByParam(customer[0], OrderCartModel);
        return res.json({ ordercarts });
    },
);

router.post(
    '/order',
    auth,
    async (req: any, res: Response): Promise<Response> => {
        console.log(req.body);
        try {
            const errors: Result = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array(), message: 'Incorrect data, please try again' });
            }
            const allOrders: OrderCart[] = await OrderCartModel.find();
            const filteredOrders: OrderCart[] = allOrders.filter(order => {
                return (
                    order.category === req.body.category &&
                    Date.parse(order.checkOut) > Date.parse(req.body.checkIn) &&
                    order.status === 'booked'
                );
            });
            if (filteredOrders.length !== 0) {
                return res.status(400).json({ message: 'Sorry, all rooms are booked' });
            }

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
    '/order/delete',
    async (req: Request, res: Response): Promise<Response> => {
        try {
            const order: OrderCart | null = await OrderCartModel.findByIdAndUpdate(req.body._id, {
                status: 'canceled',
            });
            return res.json({ order, message: 'Order was canceled' });
        } catch (e) {
            return res.json({ message: 'Something wrong happened' });
        }
    },
);

router.delete(
    '/userOrder/delete',
    auth,
    async (req: any, res: Response): Promise<Response> => {
        try {
            const order: OrderCart | null = await OrderCartModel.findByIdAndUpdate(req.body._id, {
                status: 'canceled',
            });
            await OrderModel.findOneAndRemove({ owner: req.user.userId });
            return res.json({ order, message: 'Order was canceled' });
        } catch (e) {
            return res.json({ message: 'Something wrong happened' });
        }
    },
);

router.get(
    '/order',
    auth,
    async (req: any, res: Response): Promise<Response> => {
        const orders: Order[] = await OrderInterlayer.getUserOrders(req, OrderCartModel);
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

router.get(
    '/customer',
    auth,
    async (req: Request, res: Response): Promise<Response> => {
        const customer: Customer[] | null = await CustomerInterlayer.getOneCustomer(req, CustomerModel);
        return res.json(customer[0]);
    },
);

router.put(
    '/customer/update',
    auth,
    async (req: Request, res: Response): Promise<Response> => {
        try {
            const customer: Customer[] | null = await CustomerInterlayer.updateCustomer(req.body, CustomerModel);
            return res.json({ customer, message: 'Info successfully updated' });
        } catch (e) {
            return res.json({ message: 'Something wrong happened' });
        }
    },
);

router.post(
    '/feedback/add',
    async (req: Request, res: Response): Promise<Response> => {
        try {
            const feedback: Feedback | null = await FeedbackInterlayer.postFeedback(req, FeedbackModel);
            return res.json({ feedback, message: 'Feedback successfully saved' });
        } catch (e) {
            return res.json({ message: 'Something wrong happened' });
        }
    },
);

router.get(
    '/article/:id',
    async (req: Request, res: Response): Promise<Response> => {
        const article: ArticleInt[] | null = await ArticleInterlayer.getOneArticle(req, ArticleModel);
        return res.json({ article });
    },
);

router.post('/reset', (req: Request, res: Response): void => {
    crypto.randomBytes(32, async (err, buffer) => {
        try {
            if (err) {
                return res.json({ message: 'someting wrong happened' });
            }
            const token = buffer.toString('hex');
            const candidate = await CustomerModel.findOne({ email: req.body.email });

            if (candidate) {
                candidate.resetToken = token;
                candidate.resetTokenExp = Date.now() + 60 * 60 * 1000;
                await candidate.save();
                await mailgun.messages().send(reset(candidate.email, token), function(error, body) {
                    if (error) {
                        console.log(error);
                    }
                    console.log(body);
                });
                return res.json({ message: 'Message sent, please check your email', candidate });
            } else {
                return res.json({ message: 'Incorrect email' });
            }
        } catch (e) {
            return res.json({ message: 'something wrong happened' });
        }
    });
});

router.post(
    '/password',
    async (req: Request, res: Response): Promise<Response> => {
        const user = await CustomerModel.findOne({
            resetToken: req.body.token,
        });
        if (user) {
            user.password = await bcrypt.hash(req.body.password, 10);
            delete user.resetTokenExp;
            delete user.resetToken;
            await user.save();
            return res.json({ message: 'Your password successfully changed' });
        } else {
            return res.json({ message: 'Something wrong happened' });
        }
    },
);

router.get(
    '/comment',
    async (req: Request, res: Response): Promise<Response> => {
        const comment: CommentInt[] | null = await CommentInterlayer.getAllComments(CommentModel);
        return res.json({ comment });
    },
);

router.post(
    '/comment/add',
    async (req: Request, res: Response): Promise<Response> => {
        try {
            console.log(req.body)
            const comment: CommentInt | null = await CommentInterlayer.postComment(req.body, CommentModel);
            return res.json({ comment, message: 'Comment successfully saved' });
        } catch (e) {
            return res.json({ message: 'Something wrong happened' });
        }
    },
);

router.get(
    '/comment',
    async (req: Request, res: Response): Promise<Response> => {
        const comment: CommentInt[] | null = await CommentInterlayer.getAllComments(CommentModel);
        return res.json( comment );
    },
);

router.delete(
    '/comment/delete',
    auth,
    async (req: any, res: Response): Promise<Response> => {
        try {
            const comment: CommentInt | null = await CommentInterlayer.deleteComment(req.body, CommentModel);
            return res.json({ comment, message: 'Comment was deleted' });
        } catch (e) {
            return res.json({ message: 'Something wrong happened' });
        }
    },
);

router.put(
    '/comment/update',
    auth,
    async (req: Request, res: Response): Promise<Response> => {
        try {
            const comment: CommentInt | null = await CommentInterlayer.updateComment(req.body, CommentModel);
            return res.json({ comment, message: 'Comment successfully updated' });
        } catch (e) {
            return res.json({ message: 'Something wrong happened' });
        }
    },
);

export default router;
