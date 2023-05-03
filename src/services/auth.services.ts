import bcrypt from "bcrypt"

import { createToken } from "../middlewares"
import UserModel from "../models/user.model"
import { ResponseType } from "../types/index.types"
import { UserType } from "../types/user.types"

export const Login = async (email: string, password: string): Promise<ResponseType> => {
    try {
        // Find the user with the specified email
        const user: UserType | null = await UserModel.findOne({ email })

        // If no user is found, return an error
        if (!user?._id) {
            return {
                status: 400,
                success: false,
                data: {
                    message: "Invalid credentials",
                },
            }
        }

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password || "")

        // If the passwords don't match, return an error
        if (!isMatch) {
            return {
                status: 400,
                success: false,
                data: {
                    message: "Invalid credentials",
                },
            }
        }

        // If the user is authenticated, generate a JWT token
        const token = createToken(user._id.toString(), user.type)

        return {
            status: 200,
            success: true,
            data: {
                token,
            },
        }
    } catch (error) {
        console.error("/Login", error?.message)
        return {
            status: 500,
            success: false,
        }
    }
}

export const Signup = async (email: string, password: string): Promise<ResponseType> => {
    try {
        // Check if user already exists
        const userExists = await UserModel.findOne({ email })

        if (userExists) {
            return {
                success: false,
                status: 400,
                data: {
                    message: "User already exists",
                },
            }
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Create a new user with the specified email and hashed password
        const newUser = await UserModel.create({ email, password: hashedPassword })

        // Generate a JWT token for the new user
        const token = createToken(newUser._id.toString(), newUser.type)

        // Return the token in the response
        return { success: true, status: 201, data: { token } }
    } catch (error) {
        console.error(error.message)
        return { success: false, status: 500, data: { message: "Server error" } }
    }
}
