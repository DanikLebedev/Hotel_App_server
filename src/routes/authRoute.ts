import { Router, Request, Response } from 'express';
import { check, Result, validationResult } from 'express-validator';
import Customer from '../models/customer';
import { DbServices } from '../db/dbServices';
import { auth } from '../middleware/authMiddleware';
import EmployeeModel, { EmployeeI } from '../models/employee';
import daoCustomer from '../dao/daoCustomer';
import keys from '../../keys/keys';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router: Router = Router();

interface User {
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
    async (req: CustomRequest<User>, res: Response): Promise<Response> => {
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

        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 12);
        }

        await daoCustomer.postCustomers(req.body, Customer);
        return res.status(201).json({ message: 'User was created' });
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
