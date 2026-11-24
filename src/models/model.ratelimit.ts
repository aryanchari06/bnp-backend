import mongoose from "mongoose";

const RateLimitSchema = new mongoose.Schema({
    scope: {
        type: String,
        required: true,
        unique: true
    },
    count: {
        type: Number,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        expires: 0
    }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })

const RateLimit = mongoose.model('RateLimit', RateLimitSchema)
export default RateLimit