import { DbServices } from '../db/dbServices';

export default class DaoStatus {
    public static async getAllStatuses(Model) {
        return await DbServices.getData(Model);
    }
    public static async postStatus(body, Model) {
        await DbServices.postData(body, Model);
    }
}
