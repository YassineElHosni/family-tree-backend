import express, { Router } from "express"

import { Login, Signup } from "../controllers/auth.contoller"

const router: Router = express.Router()

router.post("/signup", Signup)

router.get("/login", Login)

export default router
