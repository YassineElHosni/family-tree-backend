import express, { Router } from "express"
import authRoutes from "./auth.routes"
import usersRoutes from "./users.routes"

const version = process.env.npm_package_version

const router: Router = express.Router()

router.use("/auth", authRoutes)
router.use("/users", usersRoutes)

router.get("/", (req, res) => res.status(200).json({ version }))

export default router
