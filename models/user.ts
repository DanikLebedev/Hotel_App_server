import {Schema, model} from 'mongoose'

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    order: {
        rooms: [
            {
                count: {
                    type: Number,
                    required: true,
                    default: 1
                },
                roomId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Room',
                    required: true
                }
            }
        ]
    }

})



export default model('User', userSchema)