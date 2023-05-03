import { ObjectId } from "mongoose"

export type UserType = {
    _id?: ObjectId | string
    type?: "admin"
    email: string
    firstName: string
    lastName: string
    gender?: "female" | "male"
    birthday?: string
    phoneNumber?: {
        phone: string
        code: number
        short: string
    }
    password?: string
}

export type AuthUserType = {
    _id?: string
    type?: "admin"
}
