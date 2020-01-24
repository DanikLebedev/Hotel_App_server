import express from 'express';
import {Request, Response} from 'express';
import mongoose from 'mongoose';
import keys from "../keys/keys";
import exphbs from 'express-handlebars';
import adminRoutes from '../routes/adminRoute'
import bodyParser from "body-parser";

const app = express();
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})


app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/', adminRoutes);

app.get('/', (req: Request, res: Response) => {
    res.render('index.hbs')
})


app.use(function (req, res, next) {
    return res.status(404).render('404');
});
app.use(function (err, req, res, next) {
    return res.status(500).send({error: err});
});



const PORT = 5000;


async function start(): Promise<void> {
    try {
        await mongoose.connect(keys.MONGODB_URI, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        })
        app.listen(PORT, (): void => {
            console.log('server started at http://localhost:' + PORT);
        })
    } catch (e) {
        console.log(e)
    }
}

start()

