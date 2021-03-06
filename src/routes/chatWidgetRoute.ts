import { Router } from 'express';
import fetch from 'node-fetch';
import {auth} from "../middleware/authMiddleware";
import CustomerInterlayer from "../interlayers/customer.interlayer";
import CustomerModel from "../models/customer";

const appID = '1486021dc43c88b';
const apiKey = 'c3c0291af7c308d535611d65c573eb9ca7f3432f';
const agentUID = 'support';

const url = 'https://api-eu.cometchat.io/v2.0';

const router = Router();

const requestAuthToken = uid => {
    return new Promise((resolve, reject) => {
        fetch(`${url}/users/${uid}/auth_tokens`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                appid: appID,
                apikey: apiKey,
            },
        })
            .then(res => res.json())
            .then(data => {
                resolve(data.data.authToken);
            });
    });
};

router.get('/api/create', auth, async (req: any, res) => {
    const user = await CustomerInterlayer.getOneCustomer(req, CustomerModel)
    const data = {
        uid: new Date().getTime(),
        name: user[0].email,
    };
    const response = await fetch(`${url}/users`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            appid: appID,
            apikey: apiKey,
        },
    });
    const initData = await response.json();
    console.log(initData)
    requestAuthToken(initData.data.uid).then(token => {
        console.log('Success create :' + JSON.stringify(token));
        res.json(token);
    });
});

router.get('/api/auth', (req, res) => {
    const uid = req.query.uid;
    requestAuthToken(uid)
        .then(token => {
            console.log('Success auth:' + JSON.stringify(token));
            res.json(token);
        })
        .catch(error => console.error('Error:', error));
});



router.get('/api/users', async (req, res) => {
    const response = await fetch(`${url}/users`, {
        headers: {
            'Content-Type': 'application/json',
            appid: appID,
            apikey: apiKey,
        },
    });
    const data = await response.json();
    const filterAgentData = data.data.filter(data => {
        return data.uid !== agentUID;
    });
    res.json(filterAgentData);
});

export default router;
