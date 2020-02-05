import express, { Express } from 'express';
import path from 'path';
import cors from 'cors';
import adminRoute from './routes/adminRoute';
import bodyParser from 'body-parser';
import authRoute from './routes/authRoute';
import clientRoute from './routes/clientRoutes';
import keys from '../keys/keys';
import { DbServices } from './db/dbServices';
import multer from 'multer';

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({
    storage,
});

const app: Express = express();

app.use(upload.single('image'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    cors({
        credentials: true,
        origin: ['http://localhost:3000'],
        optionsSuccessStatus: 200,
    }),
);

app.use('/static', express.static(path.resolve('uploads')));

app.use('/api/auth', authRoute);
app.use('/api/admin', adminRoute);
app.use('/api/client', clientRoute);

app.use(function(req, res, next, err): void {
    return res.status(404).send({ error: err });
});

app.use(function(err, req, res, next): void {
    return res.status(500).send({ error: err });
});

const PORT: number = keys.PORT || 5000;

async function start(): Promise<void> {
    try {
        await DbServices.connectToMongo();
        app.listen(PORT, (): void => {
            console.log('server started at http://localhost:' + PORT);
        });
    } catch (e) {
        console.log(e);
    }
}

start();

export default app;
