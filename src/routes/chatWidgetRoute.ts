import { Router } from 'express';
import fetch from 'node-fetch';

const appID = '1486021dc43c88b';
const apiKey = 'aa7c3f35f8061e3f16e28783e2eac49e12aa503d';
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
                console.log(data)
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
