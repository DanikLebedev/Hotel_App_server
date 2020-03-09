import express, { Express } from 'express';
import path from 'path';
import cors from 'cors';
import adminRoute from './routes/adminRoute';
import chatWidgetRoute from './routes/chatWidgetRoute';
import bodyParser from 'body-parser';
import authRoute from './routes/authRoute';
import clientRoute from './routes/clientRoutes';
import keys from '../keys/keys';
import { DbServices } from './db/dbServices';
import multer from 'multer';
import cron from 'node-cron';
import OrderCartModel, { OrderCart } from './models/ordersCart';
import OrderInterlayer from './interlayers/order.interlayer';

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

app.use(express.static(path.resolve('../hotel_app_client/build')));


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

cron.schedule('30 * * * *', async function(): Promise<void> {
    const allOrders: OrderCart[] = await OrderInterlayer.getAllOrders(OrderCartModel);
    const today: number = new Date(Date.now()).getTime();
    allOrders.map(async order => {
        const checkOutDate: number = new Date(order.checkOut).getTime();
        if (checkOutDate < today) {
            order.status = 'completed';
            await OrderCartModel.findByIdAndUpdate(order._id, { status: 'completed' });
        } else {
            return;
        }
    });
});

app.use('/static', express.static(path.resolve('uploads')));

app.use('/api/auth', authRoute);
app.use('/api/admin', adminRoute);
app.use('/api/client', clientRoute);
app.use('/api/chatWidget', chatWidgetRoute);

app.use(function(req, res, next, err): void {
    return res.status(404).json({ message: 'Path not found' });
});

app.use(function(req, res, _next, err): void {
    console.log(err);
    return res.status(500).json({ message: 'Something went wrong...' });
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
