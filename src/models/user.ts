import { Schema, model, Types, Model, Document } from 'mongoose';

const userSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
    },
    order: {
        rooms: [
            {
                count: {
                    type: Number,
                    required: true,
                    default: 1,
                },
                roomId: {
                    type: Types.ObjectId,
                    ref: 'Room',
                    required: true,
                },
            },
        ],
    },
});

interface User extends Document {
    email: string;
    password: string;
    photo: string;
    order: {};
}

const UserModel: Model<User> = model<User>('User', userSchema);

export default UserModel;
