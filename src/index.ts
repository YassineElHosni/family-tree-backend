import express, { Application } from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"

import userModel from "./models/user.model"

dotenv.config()

const app: Application = express()
const port = 8000

const { DATABASE } = process.env

if (DATABASE) {
    mongoose
        .connect(DATABASE)
        .then(() => {
            console.log("MongoDB connected!")
            app.listen(port, async () => {
                console.log(`Server running at http://localhost:${port}`)
                const users = await userModel.find().lean()
                console.log("users", users)
            })
        })
        .catch((err) => console.log(err))
} else {
    console.error("Missing process.env.DATABASE !")
}
