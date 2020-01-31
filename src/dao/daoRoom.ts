import { DbServices } from '../db/dbServices';

export default class DaoRoom {
    public static async getAllRoom(req, res, Model) {
        await DbServices.getData(req, res, Model);
    }
    public static async postRooms(req, res, Model) {
        await DbServices.postData(req, res, Model);
    }
}
