import { Router, Request, Response } from 'express';
import Chatkit from '@pusher/chatkit-server';
import keys from '../../keys/keys';

const router: Router = Router();

const chatkit = new Chatkit({
    instanceLocator: keys.CHATKIT_INSTANCE_LOCATOR,
    key: keys.CHATKIT_SECRET_KEY,
});


router.post('/users', (req, res) => {
    const { userId } = req.body;

    chatkit
        .createUser({
            id: userId,
            name: userId,
        })
        .then(() => {
            res.sendStatus(201);
        })
        .catch(err => {
            if (err.error === 'services/chatkit/user_already_exists') {
                console.log(`User already exists: ${userId}`);
                res.sendStatus(200);
            } else {
                res.status(err.status).json(err);
            }
        });
});

router.post('/authenticate', (req, res) => {
    const authData = chatkit.authenticate({
        userId: req.query.user_id,
    });
    res.status(authData.status).send(authData.body);
});

export default router;
