import { DbServices } from '../db/dbServices';
import { ArticleInt } from '../models/article';

export default class ArticleInterlayer {
    public static async getAllArticles(Model): Promise<ArticleInt[]> {
        return await DbServices.getData(Model);
    }
    public static async postArticle(req, Model) {
        req.body.image = req.file.filename;
        return await DbServices.postData(req.body, Model);
    }

    public static async getOneArticle(req, Model): Promise<ArticleInt[]> {
        return await DbServices.getDataByParam({ _id: req.params.id }, Model);
    }

    public static async deleteArticle(body, Model): Promise<ArticleInt> {
        return await DbServices.deleteData(body, Model);
    }

    public static async updateArticle(req, Model): Promise<ArticleInt> {
        if (!req.file) {
            delete req.body.image;
            return await DbServices.updateData(req.body, Model);
        } else {
            req.body.image = req.file.filename;
            return await DbServices.updateData(req.body, Model);
        }
    }
}
