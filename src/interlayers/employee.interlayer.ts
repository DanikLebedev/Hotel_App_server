import { DbServices } from '../db/dbServices';
import bcrypt from 'bcryptjs';

export default class EmployeeInterlayer {
    public static async getAllEmployees(Model) {
        return await DbServices.getData(Model);
    }
    public static async postEmployees(body, Model) {
        body.password = await bcrypt.hash(body.password, 12);
        return await DbServices.postData(body, Model);
    }
}
