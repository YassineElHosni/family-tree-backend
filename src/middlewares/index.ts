import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

import { AuthUserType } from "../types/user.types"

dotenv.config()

const { JWT_SECRET } = process.env

if (!JWT_SECRET) {
    throw new Error("Missing process.env.JWT_SECRET !")
}

interface IAuthRequest extends Request {
    user?: AuthUserType
}

const createToken = (userId: string, type: string) => {
    return jwt.sign({ _id: userId, type }, JWT_SECRET, { expiresIn: "1h" })
}

/**
 * @disabled
 */
const verifyToken = (req: IAuthRequest, res: Response, next: NextFunction) => {
    return next()
    const token = req.headers["authorization"]

    if (!token) {
        return res.status(401).json({ message: "Authorization denied" })
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as AuthUserType
        req.user = decoded

        next()
    } catch (err) {
        res.status(401).json({ message: "Invalid token" })
    }
}

export { createToken, verifyToken }
