import jwt from 'jsonwebtoken';
import keys from '../../keys/keys';

export const auth: Function = (req, res, next): Response | void => {
    if (req.method === 'OPTIONS') {
        return next();
    }

    try {
        const token: string = req.headers.authorization.split(' ')[1]; // "Bearer TOKEN"

        if (!token) {
            res.redirect('/auth');
        }

        const decoded = jwt.verify(token, keys.jwtSecret);
        req.user = decoded;
        next();
    } catch (e) {
        res.status(401).json({ message: 'Need to authorize' });
    }
};
