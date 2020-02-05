import { DbServices } from '../db/dbServices';

export default class RoomInterlayer {
    public static async getAllRoom(Model) {
        return await DbServices.getData(Model);
    }
    public static async postRooms(req, Model) {
        req.body.image = req.file.filename
        return await DbServices.postData(req.body, Model);
    }
}
