"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var roomSchema = new mongoose_1.Schema({
    category: String,
    price: Number,
    status: Number,
    bedsQuantity: Number,
    area: Number,
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    },
    isBooked: Boolean,
    description: String
});
exports["default"] = mongoose_1.model('Room', roomSchema);