import { Router, Request, Response } from 'express';
import Category from '../models/category';
import { auth } from '../middleware/authMiddleware';
const router = Router();

// router.get(
//     '/',
//     auth,
//     async (req: any, res: Response): Promise<void> => {
//         try {
//             const orders = await Category.find({ owner: req.user.userId });
//             res.json(orders);
//         } catch (e) {
//             console.log(e);
//         }
//     },
// );
//
export default router;
