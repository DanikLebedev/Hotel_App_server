import { DbServices } from '../db/dbServices';
import { Feedback } from '../models/feedback';

export default class FeedbackInterlayer {
    public static async getAllFeedbacks(Model): Promise<Feedback[]> {
        return await DbServices.getData(Model);
    }
    public static async postFeedback(req, Model): Promise<Feedback> {
        return await DbServices.postData(req.body, Model);
    }

    public static async deleteFeedback(body, Model): Promise<Feedback> {
        return await DbServices.deleteData(body, Model);
    }

    public static async updateFeedback(body, Model): Promise<Feedback> {
        return await DbServices.updateData(body, Model);
    }
}
