import { DbServices } from '../db/dbServices';

export default class StatusController {
    public static async getAllStatuses(Model) {
        return await DbServices.getData(Model);
    }
    public static async postStatus(body, Model) {
        return await DbServices.postData(body, Model);
    }
}
