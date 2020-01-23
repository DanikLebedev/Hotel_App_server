import express from 'express';
import {Request, Response} from 'express';

const app = express();

const {
    PORT = 3010,
} = process.env;

app.get('/', async (req: Request, res: Response) => {
    res.send({
        message: 'hello world',
    });
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log('server started at http://localhost:' + PORT);
    });
}


export default app;