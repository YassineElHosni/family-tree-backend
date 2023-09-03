import express, { Application } from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"
import bodyParser from "body-parser"
import dgraph from "dgraph-js"

dotenv.config()

import dgraphInstance from "./dgraph-instance"
import routes from "./routes"
import { createPerson, getPersonAll, getPersonById, updatePersonName } from "./services/person.services"
import {
    addChildToPartnership,
    createPartnership,
    deletePartnership,
    getPartnershipAll,
    getPartnershipById,
} from "./services/partnership.services"
import schema from "./schema"

const app: Application = express()
const port = process.env.PORT || 8000

const { CLIENT_URL, DATABASE } = process.env

if (!DATABASE) {
    throw new Error("Missing process.env.DATABASE !")
}
if (!CLIENT_URL) {
    throw new Error("Missing process.env.CLIENT_URL !")
}

// Use the body-parser middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use("/api", routes)

app.use(
    cors({
        credentials: true,
        origin: [CLIENT_URL],
    })
)

mongoose
    .connect(DATABASE)
    .then(() => console.log("MongoDB connected!"))
    .catch(error => console.error("/mongoose - error", error))
// Initialize Dgraph client

export const setSchema = async () => {
    try {
        const op = new dgraph.Operation()

        op.setSchema(schema)

        await dgraphInstance.alter(op)
        console.log("Schema has been successfully set.")
    } catch (error) {
        console.error("Error setting schema: ", error)
    }
}

const factoryDefault = async () => {
    const response1: any = await createPerson("Abdelaziz EL HOSNI", "MALE")
    const personId1 = response1?.data?.id

    const response2: any = await createPerson("Widad DOUGHAILI", "FEMALE")
    const personId2 = response2?.data?.id

    const response3: any = await createPartnership(personId1, personId2)
    const partnershipId = response3?.data?.id

    await createPerson("Yassine EL HOSNI", "MALE", partnershipId)
    await createPerson("Hamza EL HOSNI", "MALE", partnershipId)
    await createPerson("Zakariya EL HOSNI", "MALE", partnershipId)

    const response4: any = await createPerson("Lakbira BEN ACHIR", "FEMALE")
    const personId4 = response4?.data?.id

    const response5: any = await createPartnership(undefined, personId4)
    const partnershipId2 = response5?.data?.id

    await addChildToPartnership(partnershipId2, personId1, true)
}

async function main() {
    await setSchema()

    // await factoryDefault()

    const response1 = await getPersonAll()
    const response2 = await getPartnershipAll()

    console.log("result1", response1?.data)
    console.log("result2", response2?.data)
}

main()
    .then(() => {
        console.log("Script finished.")
    })
    .catch(e => {
        console.error("Error: ", e)
    })

app.listen(port, async () => {
    console.log(`Server running at http://localhost:${port}`)
})
