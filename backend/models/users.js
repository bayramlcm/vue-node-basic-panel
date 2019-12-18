const mongoose = require('mongoose');

const { Schema } = mongoose;

/* eslint-disable max-len */
const usersSchema = new Schema({
    name: { type: String, trim: true },
    username: { type: String, trim: true, required: true },
    password: { type: String, trim: true, required: true, select: false },
    isDeleted: { type: Boolean, default: false, select: false },
    permissions: {
        accountAdd: {type: Boolean, default: false},
        accountUpdate: {type: Boolean, default: false},
        accountDelete: {type: Boolean, default: false},
        accountGetAll: {type: Boolean, default: false},
    }
}, { collection: 'users' });

module.exports = mongoose.model('users', usersSchema);