'use strict';
exports.__esModule = true;
const mongoose_1 = require('mongoose');
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});
exports['default'] = mongoose_1.model('User', userSchema);
