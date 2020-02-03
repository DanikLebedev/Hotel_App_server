import { DbServices } from '../db/dbServices';

export default class DaoEmployee {
    public static async getAllEmployees(Model) {
        return await DbServices.getData(Model);
    }
    public static async postEmployees(body, Model) {
        return await DbServices.postData(body, Model);
    }
}
