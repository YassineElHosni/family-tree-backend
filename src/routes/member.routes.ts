import express, { Router } from "express"

import { verifyToken } from "../middlewares"
import * as memberControllers from "../controllers/member.contoller"

const router: Router = express.Router()

router.get("/", verifyToken, memberControllers.getAll)

router.post("/", verifyToken, memberControllers.create)

router.patch("/:id", verifyToken, memberControllers.edit)

export default router
