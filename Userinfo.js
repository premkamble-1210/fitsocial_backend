const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    Description: {
        type: String,
    },
    challenge_name: {
        type: String,
    },
    start_date: {
        type: String,
    },
    end_date: {
        type: String,
    },
    Points: {
        type: String,
    },
});

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
    username: {
        type: String,
    },
    profile_icon: {
        type: String,
    }
});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    followers: {
        type: Number
    },
    posts: [postSchema],
    challenges: [challengeSchema]
});

const Userinfo = mongoose.model("Userinfo", userSchema);
module.exports = Userinfo;
