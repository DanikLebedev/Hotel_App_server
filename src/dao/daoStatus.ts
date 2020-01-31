import { DbServices } from '../db/dbServices';

export default class DaoStatus {
    public static async getAllStatuses(req, res, Model) {
        await DbServices.getData(req, res, Model);
    }
    public static async postStatus(req, res, Model) {
        await DbServices.postData(req, res, Model)
    }
}
