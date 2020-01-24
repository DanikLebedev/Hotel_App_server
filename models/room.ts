import {Schema, model} from "mongoose";
import Room from "../interfaces";
const roomSchema = new Schema({
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: Number,
        required: true
    },
    bedsQuantity: {
        type: Number,
        required: true
    },
    area: {
        type: Number,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    isBooked: Boolean,
    description: String,
})


export default model('Room', roomSchema)