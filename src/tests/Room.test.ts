import mongoose from 'mongoose';
import keys from '../../keys/keys';
import daoRoom from '../controllers/room.controller';
import RoomModel from '../models/room';

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

describe('All Models Testing', () => {
    beforeAll(async () => {
        await mongoose.connect(
            keys.MONGODB_URI,
            { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
            err => {
                if (err) {
                    console.error(err);
                    process.exit(1);
                }
            },
        );
    });

    it('should get all rooms', async () => {
        const validRoom = await daoRoom.getAllRoom(RoomModel);
        expect(validRoom).toBeDefined();
        expect(validRoom[0].price).toBeDefined();
    });

    it('should create new room', async () => {
        const validRoom = await daoRoom.postRooms(roomData, RoomModel);
        expect(validRoom).toBeDefined();
        expect(validRoom['image']).toBe(roomData['image']);
    });

    it('should return room validation error ', async () => {
        const invalidRoom = await daoRoom.postRooms(roomData, RoomModel);
        expect(invalidRoom).toBeUndefined();
    });
});
