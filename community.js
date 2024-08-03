const mongoose = require('mongoose');
const community = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    profile_icon: {
        type: String,
    },
    comment: {
        type: String,
        
    }
});
const communitychat=mongoose.model("communitychat",community);
module.exports = communitychat;