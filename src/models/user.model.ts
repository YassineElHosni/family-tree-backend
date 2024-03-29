import { model } from "mongoose"
import { UserType } from "../types/user.types"

const mongoose = require("mongoose")

const userSchema = mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["admin", null],
            default: null,
        },
        email: { type: String },
        firstName: { type: String },
        lastName: { type: String },
        gender: {
            type: String,
            enum: ["male", "female", null],
            default: null,
        },
        birthday: { type: String },
        phoneNumber: {
            phone: { type: String },
            code: { type: Number },
            short: { type: String },
        },
        password: { type: String },
    },
    {
        timestamps: true,
    }
)

export default model<UserType>("user", userSchema, "users")
