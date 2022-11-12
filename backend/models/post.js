const mongoose= require('mongoose');

const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    image: String,
    user: {
        type: mongoose.Types.ObjectId,
        ref: "user",
    }

}, {timestamps: true})

const postModel = mongoose.model("post", postSchema)
module.exports = postModel;