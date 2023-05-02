import { model } from "mongoose"
import { UserType } from "../types/user.types"

const mongoose = require("mongoose")

const userSchema = mongoose.Schema(
    {
        type: {
            enum: {
                values: ["admin"],
            },
        },
        email: { type: String },
        firstName: { type: String },
        lastName: { type: String },
        gender: {
            enum: {
                values: ["female", "male"],
            },
        },
        birthday: { type: String },
        phoneNumber: {
            phone: { type: String },
            code: { type: Number },
            short: { type: String },
        },
    },
    {
        timestamps: true,
    }
)

export default model<UserType>("user", userSchema, "users")
