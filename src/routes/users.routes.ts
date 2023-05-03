import express, { Router } from "express"

import { verifyToken } from "../middlewares"
import { FindOne } from "../controllers/users.contoller"

const router: Router = express.Router()

router.get("/:userId", verifyToken, FindOne)

export default router
