import { DbServices } from '../db/dbServices';
import { CommentInt } from '../models/comment';

export default class CommentInterlayer {
    public static async getAllComments(Model): Promise<CommentInt[]> {
        return await DbServices.getData(Model);
    }
    public static async postComment(body, Model): Promise<CommentInt> {
        return await DbServices.postData(body, Model);
    }

    public static async deleteComment(body, Model): Promise<CommentInt> {
        return await DbServices.deleteData(body, Model);
    }

    public static async updateComment(body, Model): Promise<CommentInt> {
        return await DbServices.updateData(body, Model);
    }
}
