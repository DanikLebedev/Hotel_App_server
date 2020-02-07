import { DbServices } from '../db/dbServices';
import bcrypt from 'bcryptjs';

export default class EmployeeInterlayer {
    public static async getAllEmployees(Model) {
        return await DbServices.getData(Model);
    }
    public static async postEmployees(req, Model) {
        req.body.password = await bcrypt.hash(req.body.password, 12);
        return await DbServices.postData(req.body, Model);
    }
}
