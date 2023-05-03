import * as UserServices from "../services/users.services"

export const FindOne = async (req, res) => {
    const { userId } = req.params

    const result = await UserServices.FindOne(userId, req.user)

    res.status(result.status).json(result)
}
