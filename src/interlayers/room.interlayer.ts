import { DbServices } from '../db/dbServices';
import { RoomInt } from '../models/room';

function getBool(val) {
    return !!JSON.parse(String(val).toLowerCase());
}

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

    public static async deleteRoom(body, Model): Promise<RoomInt> {
        return await DbServices.deleteData(body, Model);
    }

    public static async updateRoom(req, Model): Promise<RoomInt> {
        console.log(req.body.balcony)
        if (!req.file) {
            delete req.body.image;
            return await DbServices.updateData(req.body, Model);
        } else {
            req.body.image = req.file.filename;
            return await DbServices.updateData(req.body, Model);
        }
    }
}
