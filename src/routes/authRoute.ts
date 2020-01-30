import { Router, Request, Response } from 'express';
import { check } from 'express-validator';
import Customer from '../models/customer';
import { DbServices } from '../db/dbServices';
import { auth } from '../middleware/authMiddleware';

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
    async (req: CustomRequest<User>, res: Response): Promise<void> => {
        await DbServices.registerUser(req, res, Customer);
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
