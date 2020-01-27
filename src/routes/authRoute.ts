import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { check, validationResult, Result, ValidationError } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import keys from '../../keys/keys';

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
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array(), message: 'Incorrect data, please try again' });
        }

        try {
            const { email, password }: User = req.body;

            const candidate = await User.findOne({ email });

            if (candidate) {
                return res.status(400).json({
                    message: 'Тhis email is already used',
                });
            }

            const hashPassword = await bcrypt.hash(password, 12);

            const user = new User({
                email,
                password: hashPassword,
            });

            await user.save();

            return res.status(201).json({ message: 'User was created' });
        } catch (e) {
            return res.status(500).json({ message: 'something wrong happen...' });
        }
    },
);

router.post(
    '/login',
    [
        check('email', 'Incorrect email').isEmail(),
        check('password', "Minimal password's length is 6").isLength({ min: 6 }),
    ],
    async (req: Request, res: Response): Promise<Response> => {
        const errors: Result<ValidationError> = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array(), message: 'incorrect login or password' });
        }

        try {
            const { email, password }: User = req.body;

            const user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }

            const isMatch: boolean = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ message: 'Incorrect password' });
            }

            const token = jwt.sign({ userId: user.id }, keys.jwtSecret, { expiresIn: '1h' });
            return res.json({ token, userId: user.id});
        } catch (e) {
            return res.status(500).json({ message: 'something wrong happen...' });
        }
    },
);

export default router;
