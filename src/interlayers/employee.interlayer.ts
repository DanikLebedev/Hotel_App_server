import { DbServices } from '../db/dbServices';
import bcrypt from 'bcryptjs';
import {EmployeeI} from "../models/employee";
import {CategoryInt} from "../models/category";

export default class EmployeeInterlayer {
    public static async getAllEmployees(Model): Promise<EmployeeI[]> {
        return await DbServices.getData(Model);
    }
    public static async postEmployees(req, Model) {
        req.body.password = await bcrypt.hash(req.body.password, 12);
        return await DbServices.postData(req.body, Model);
    }

    public static async deleteEmployee(body, Model): Promise<EmployeeI> {
        return await DbServices.deleteData(body, Model);
    }

    public static async updateEmployee(body, Model): Promise<EmployeeI> {
        return await DbServices.updateData(body, Model);
    }
}
