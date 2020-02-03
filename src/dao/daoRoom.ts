import { DbServices } from '../db/dbServices';
import fs from 'fs';

export default class DaoRoom {
    public static async getAllRoom(Model) {
        return await DbServices.getData(Model);
    }
    public static async postRooms(req, Model) {
        if (req.body.image) {
            req.body.image.data = fs.readFileSync(req.file.path);
            req.body.image.contentType = req.file.mimetype;
            return await DbServices.postData(req.body, Model);
        } else {
            console.log('file not found');
        }
    }
}
