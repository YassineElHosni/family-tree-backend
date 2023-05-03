import { ResponseType } from "../types/index.types"
import { UserType } from "../types/user.types"
import UserModel from "../models/user.model"

export const FindOne = async (userId: string, userCalling: any): Promise<ResponseType> => {
    try {
        if (userCalling._id !== userId && userCalling.type !== "admin") {
            return {
                status: 400,
                success: false,
            }
        }
        const user: UserType | null = await UserModel.findById(userId)

        return {
            status: 200,
            success: true,
            data: {
                user,
            },
        }
    } catch (error) {
        console.error("/FindOne", error?.message)
        return {
            status: 500,
            success: false,
        }
    }
}
