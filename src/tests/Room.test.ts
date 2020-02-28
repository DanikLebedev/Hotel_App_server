import mongoose from 'mongoose';
import keys from '../../keys/keys';
import RoomInterlayer from '../interlayers/room.interlayer';
import RoomModel from '../models/room';
import { DbServices } from '../db/dbServices';

const roomData = {
    category: 'Standart',
    title: 'string',
    price: 123,
    area: 123,
    guests: 2,
    rooms: 2,
    description: 'string',
    image: 'string',
};

const updateRoomData = {
    _id: '5e58df1cfca5c506cc4cc589',
    title: 'Update title',
};

describe('All Models Testing', () => {
    beforeAll(async () => {
        await mongoose.connect(
            keys.MONGODB_URI,
            { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false },
            err => {
                if (err) {
                    console.error(err);
                    process.exit(1);
                }
            },
        );
    });

    it('should get all rooms', async () => {
        const validRoom = await RoomInterlayer.getAllRoom(RoomModel);
        expect(validRoom).toBeDefined();
        expect(validRoom[0].price).toBeDefined();
    });

    it('should create new room', async () => {
        const validRoom = await DbServices.postData(roomData, RoomModel);
        expect(validRoom).toBeDefined();
        expect(validRoom['image']).toBe(roomData['image']);
    });

    it('should delete room', async () => {
        const validRoom = await RoomInterlayer.deleteRoom({ _id: '5e58d9b646d736234453c5c7' }, RoomModel);
        expect(validRoom).toBeDefined();
        expect(validRoom['title']).toBe('De luxe');
    });

    it('should update room', async () => {
        const validRoom = await RoomInterlayer.updateRoom(updateRoomData, RoomModel);
        expect(validRoom).toBeDefined();
        expect(validRoom['title']).toBe(updateRoomData['title']);
    });

    it('should return room validation error ', async () => {
        const invalidRoom = await RoomInterlayer.postRooms(roomData, RoomModel);
        expect(invalidRoom).toBeUndefined();
    });
});
