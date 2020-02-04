import { Result, ValidationError, validationResult } from 'express-validator';
import mongoose  from 'mongoose';
import keys from '../../keys/keys';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface Auth {
    email: string;
    password: string;
    status?: string;
}

export class DbServices {
    public static async getData(Model): Promise<void> {
        try {
            const data: any = await Model.find();
            return data;
        } catch (e) {
            console.log(e);
        }
    }

    public static async postData(body, Model): Promise<any> {
        try {
            const postParams: {} = { ...body };
            const data = new Model({
                ...postParams,
            });
            await data.save();
            return data;
        } catch (e) {
            console.log(e);
        }
    }

    public static async connectToMongo(): Promise<void> {
        await mongoose.connect(keys.MONGODB_URI, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
        });
    }

    public static async loginUser(req, res, Model) {
        const errors: Result<ValidationError> = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array(), message: 'incorrect login or password' });
        }

        try {
            const postParams: Auth = { ...req.body };

            const user = await Model.findOne({ email: postParams.email });

            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }

            const isMatch: boolean = await bcrypt.compare(postParams.password, user.password);

            if (!isMatch) {
                return res.status(400).json({ message: 'Incorrect password' });
            }

            const token: string = jwt.sign({ userId: user.id }, keys.jwtSecret, { expiresIn: '1h' });
            return res.json({ token, userId: user.id });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: e });
        }
    }
    public static async deleteItem(req, res, Model, param) {}
}