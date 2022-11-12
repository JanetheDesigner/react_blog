const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {
        unique: true,
        type: String,
        required: true,
        null: false
    },
    role: {
        type: String,
        default: "user"
    },
    password: String,
    gender: String,
    profileImage: String
}, { timestamps: true })

const UserModel = mongoose.model("user", userSchema)
module.exports = UserModel;