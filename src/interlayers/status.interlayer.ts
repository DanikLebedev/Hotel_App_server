import { DbServices } from '../db/dbServices';
import { StatusInt } from '../models/status';

export default class StatusInterlayer {
    public static async getAllStatuses(Model): Promise<StatusInt[]> {
        return await DbServices.getData(Model);
    }
    public static async postStatus(body, Model) {
        return await DbServices.postData(body, Model);
    }
}
