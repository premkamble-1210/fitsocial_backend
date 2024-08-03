const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    caption: {
        type: String,
        required: true
    },
    post_img: {
        type: String,
    },
    Likes: {
        type: Number,
        default: 0
    },
    Comments: {
        type: [String],
        default: []
    },
    username:{
        type: String,
    },
    profile_icon:{
        type: String,
    }

});
const feedPost=mongoose.model("feedPost",postSchema);
module.exports = feedPost;