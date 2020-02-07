import { DbServices } from '../db/dbServices';

export default class CustomerInterlayer {
    public static async getAllCustomers(Model): Promise<void> {
        return await DbServices.getData(Model);
    }
    public static async postCustomers(body, Model) {
        return await DbServices.postData(body, Model);
    }
}