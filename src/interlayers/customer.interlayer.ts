import { DbServices } from '../db/dbServices';
import { Customer } from '../models/customer';

export default class CustomerInterlayer {
    public static async getAllCustomers(Model): Promise<Customer[]> {
        return await DbServices.getData(Model);
    }
    public static async postCustomers(body, Model) {
        return await DbServices.postData(body, Model);
    }
}
