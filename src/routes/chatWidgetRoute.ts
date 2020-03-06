import { Router } from 'express';
import fetch from 'node-fetch';

const appID = '1485958f328b7c5';
const apiKey = '6c9a68b2b740e48f082a6f6901e064e810cb8473';
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

router.get('/api/create', async (req, res) => {
    const data = {
        uid: new Date().getTime(),
        name: 'customer',
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
    requestAuthToken(initData.data.uid).then(token => {
        console.log('Success:' + JSON.stringify(token));
        res.json(token);
    });
});

router.get('/api/auth', (req, res) => {
    const uid = req.query.uid;
    requestAuthToken(uid)
        .then(token => {
            console.log('Success:' + JSON.stringify(token));
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
