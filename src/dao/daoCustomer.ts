import { DbServices } from '../db/dbServices';

export default class DaoCustomer {
    public static async getAllCustomers(Model) {
        return await DbServices.getData(Model);
    }
    public static async postCustomers(body, Model) {
        return await DbServices.postData(body, Model);
    }
}
