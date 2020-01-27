import express, { Express } from 'express';
import mongoose from 'mongoose';
import exphbs from 'express-handlebars';
import cors from 'cors';
import adminRoute from './routes/adminRoute';
import bodyParser from 'body-parser';
import authRoute from './routes/authRoute';
import orderRoute from './routes/orderRoutes';
import keys from '../keys/keys';

const app: Express = express();
const hbs: Exphbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
});

app.engine('hbs', hbs.engine);

app.set('view engine', 'hbs');

app.set('views', 'views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    cors({
        credentials: true,
        origin: ['http://localhost:3000'],
        optionsSuccessStatus: 200,
    }),
);
app.use('/api/auth', authRoute);
app.use('/api/admin', adminRoute);
app.use('/api/orders', orderRoute);

app.use(function(req, res, next): void {
    return res.status(404).render('404');
});

app.use(function(err, req, res, next): void {
    return res.status(500).send({ error: err });
});

const PORT: number = keys.PORT || 5000;

async function start(): Promise<void> {
    try {
        await mongoose.connect(keys.MONGODB_URI, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
        });

        app.listen(PORT, (): void => {
            console.log('server started at http://localhost:' + PORT);
        });
    } catch (e) {
        console.log(e);
    }
}

start();

export default app;
