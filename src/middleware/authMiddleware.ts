import jwt from 'jsonwebtoken';
import keys from '../../keys/keys';

export const auth = (req, res, next): Response | void => {
    if (req.method === 'OPTIONS') {
        return next();
    }

    const token: string = req.headers.authorization.split(' ')[1]; //

    if (!token) {
        console.log('no token');
        return res.redirect('/api/auth');
    }

    const decoded: {} = jwt.verify(token, keys.jwtSecret);
    req.user = decoded;
    next();
};
