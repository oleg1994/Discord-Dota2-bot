const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    discordID: {
        type: Array,
    },
    steamID: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('User', userSchema);