import express, { Application } from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"
import bodyParser from "body-parser"

import routes from "./routes"

dotenv.config()

const app: Application = express()
const port = process.env.PORT || 8000

const { ORIGIN_URL, DATABASE } = process.env

if (!DATABASE) {
    throw new Error("Missing process.env.DATABASE !")
}
if (!ORIGIN_URL) {
    throw new Error("Missing process.env.ORIGIN_URL !")
}

// Use the body-parser middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use("/api", routes)

app.use(
    cors({
        credentials: true,
        origin: [ORIGIN_URL, "http://localhost:3000"],
    })
)

mongoose
    .connect(DATABASE)
    .then(() => {
        console.log("MongoDB connected!")
        app.listen(port, async () => {
            console.log(`Server running at http://localhost:${port}`)
        })
    })
    .catch(err => console.log(err))
