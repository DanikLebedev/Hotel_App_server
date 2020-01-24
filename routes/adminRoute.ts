import {Router, Request, Response} from 'express'
import User from "../models/user";
const router = Router();

router.post('/admin', async (req:Request, res:Response) => {
    const user = new User({
        email: req.body.email,
        password: req.body.password,
    })
    res.send(JSON.stringify(user))
    try {
        await user.save()
        res.redirect('/')
    } catch (e) {
        console.log(e)
    }
})

// router.get('/admin', function(req, res, next) {
//     res.json([{
//         id: 1,
//         username: "samsepi0l"
//     }, {
//         id: 2,
//         username: "D0loresH4ze"
//     }]);
// });


export default router