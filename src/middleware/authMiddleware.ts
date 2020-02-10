import jwt from 'jsonwebtoken';
import keys from '../../keys/keys';

export const auth = (req, res, next): Response | void => {
    if (req.method === 'OPTIONS') {
        return next();
    }

    try {
        const token = req.headers.authorization.split(' ')[1]; // "Bearer TOKEN"

        if (!token) {
            return res.status(401).json({ message: 'Need to authorize' });
        }

        const decoded = jwt.verify(token, keys.jwtSecret);
        req.user = decoded;
        next();
    } catch (e) {
        res.status(401).json({ message: 'Need to authorize' });
    }
};
