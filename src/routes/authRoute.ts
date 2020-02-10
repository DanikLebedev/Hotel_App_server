import { Router, Request, Response } from 'express';
import { check, Result, validationResult } from 'express-validator';
import Customer from '../models/customer';
import { DbServices } from '../db/dbServices';
import daoCustomer from '../interlayers/customer.interlayer';
import bcrypt from 'bcryptjs';

const router: Router = Router();

interface CustomerInt {
    email: string;
    password: string;
}
interface CustomRequest<T> extends Request {
    body: T;
}

router.post(
    '/register',
    [
        check('email', 'Incorrect email').isEmail(),
        check('password', "Minimal password's length is 6").isLength({ min: 6 }),
    ],
    async (req: CustomRequest<CustomerInt>, res: Response): Promise<Response> => {
        const errors: Result = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array(), message: 'Incorrect data, please try again' });
        }
        const candidate: CustomerInt | null = await Customer.findOne({ email: req.body.email });
        if (candidate) {
            return res.status(400).json({
                message: 'Тhis email is already used',
            });
        }

        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 12);
        }
        const customers: CustomerInt = await daoCustomer.postCustomers(req.body, Customer);
        return res.status(201).json({ message: 'User was created', customers });
    },
);

router.post(
    '/login',
    [
        check('email', 'Incorrect email').isEmail(),
        check('password', "Minimal password's length is 6").isLength({ min: 6 }),
    ],
    async (req: Request, res: Response): Promise<void> => {
        await DbServices.loginUser(req, res, Customer);
    },
);

export default router;
