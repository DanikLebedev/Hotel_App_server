import { DbServices } from '../db/dbServices';
import { RoomInt } from '../models/room';

export default class RoomInterlayer {
    public static async getAllRoom(Model): Promise<RoomInt[]> {
        return await DbServices.getData(Model);
    }
    public static async postRooms(req, Model) {
        req.body.image = req.file.filename;
        return await DbServices.postData(req.body, Model);
    }

    public static async getOneRoom(req, Model): Promise<RoomInt[]> {
        return await DbServices.getDataByParam({ _id: req.params.id }, Model);
    }
}
