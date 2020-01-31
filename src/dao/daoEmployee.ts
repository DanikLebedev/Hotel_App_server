import { DbServices } from '../db/dbServices';

export default class DaoEmployee {
    public static async getAllEmployees(req, res, Model) {
        await DbServices.getData(req, res, Model);
    }
    public static async postEmployees(req, res, Model) {
        await DbServices.registerUser(req, res, Model)
    }
}
