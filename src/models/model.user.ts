import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    hashedPassword: {
        type: String,
        required: true
    }

}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })

const User = mongoose.model('User', UserSchema)
export default User