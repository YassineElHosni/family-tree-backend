import dgraph from "dgraph-js"

import { ResponseType } from "../types/index.types"
import dgraphInstance from "../dgraph-instance"
import { addChildToPartnership, getPartnershipById } from "./partnership.services"

export const getPersonAll = async (): Promise<ResponseType> => {
    try {
        const query = `
            query {
                all(func: type("Person")) {
                    uid
                    id
                    firstName
                    lastName
                    gender
                    father {
                        id
                        firstName
                        lastName
                    }
                    mother {
                        id
                        firstName
                        lastName
                    }
                    partnerships {
                        uid
                        partner1
                        partner2
                        children {
                            uid
                        }
                    }
                }
            }
        `
        const response = await dgraphInstance.newTxn().query(query)

        return {
            status: 200,
            success: true,
            data: response.getJson().all,
        }
    } catch (error) {
        console.error("/getPersonAll - error", error)

        return {
            status: 500,
            success: false,
        }
    }
}

export const createPerson = async (
    firstName: string,
    lastName: string,
    gender: string,
    parentsPartnershipId?: string
): Promise<ResponseType> => {
    const txn = dgraphInstance.newTxn()
    try {
        const person: any = {
            "dgraph.type": "Person",
            uid: "_:new-id",
            "Person.firstName": firstName,
            "Person.lastName": lastName,
            "Person.gender": gender,
            firstName: firstName,
            lastName: lastName,
            gender: gender,
        }

        if (parentsPartnershipId) {
            const response = await getPartnershipById(parentsPartnershipId)

            const partnership: any = response.data

            if (partnership) {
                if (partnership.partner1) {
                    person["Person.father"] = { uid: partnership.partner1 }
                    person.father = partnership.partner1
                }
                if (partnership.partner2) {
                    person["Person.mother"] = { uid: partnership.partner2 }
                    person.mother = partnership.partner2
                }
            }
        }

        const mutation = new dgraph.Mutation()
        mutation.setSetJson(person)

        const response = await txn.mutate(mutation)
        await txn.commit()

        const personId = response.getUidsMap().get("new-id")

        if (parentsPartnershipId) {
            await addChildToPartnership(parentsPartnershipId, personId)
        }

        return {
            status: 200,
            success: true,
            data: {
                id: personId,
            },
        }
    } catch (error) {
        console.error("/createPerson - error", error)

        return {
            status: 500,
            success: false,
        }
    } finally {
        await txn.discard()
    }
}

export const getPersonById = async (id: string): Promise<ResponseType> => {
    try {
        const query = `
            query person($id: string) {
                person(func: uid($id)) {
                    uid
                    firstName
                    lastName
                    gender
                }
            }
        `
        const vars = { $id: id }

        const response = await dgraphInstance.newTxn().queryWithVars(query, vars)

        return {
            status: 200,
            success: true,
            data: response.getJson().person[0],
        }
    } catch (error) {
        console.error("/getPersonById - error", error)

        return {
            status: 500,
            success: false,
        }
    }
}

export const updatePersonName = async (id: string, firstName: string, lastName: string): Promise<ResponseType> => {
    const txn = dgraphInstance.newTxn()
    try {
        const mutation = new dgraph.Mutation()
        mutation.setSetJson({
            "dgraph.type": "Person",
            uid: id,
            firstName,
            "Person.firstName": firstName,
            lastName,
            "Person.lastName": lastName,
        })

        await txn.mutate(mutation)
        await txn.commit()

        return {
            status: 200,
            success: true,
        }
    } catch (error) {
        console.error("/updatePersonName - error", error)

        return {
            status: 500,
            success: false,
        }
    } finally {
        await txn.discard()
    }
}

export const updatePersonPartnership = async (id: string, partnershipId: string): Promise<ResponseType> => {
    const txn = dgraphInstance.newTxn()
    try {
        const mutation = new dgraph.Mutation()
        mutation.setSetJson({
            "dgraph.type": "Person",
            uid: id,
            partnerships: { uid: partnershipId },
            "Person.partnerships": { uid: partnershipId },
        })

        await txn.mutate(mutation)
        await txn.commit()

        return {
            status: 200,
            success: true,
        }
    } catch (error) {
        console.error("/updatePersonPartnership - error", error)

        return {
            status: 500,
            success: false,
        }
    } finally {
        await txn.discard()
    }
}

export const addParent = async (
    personId: string,
    parentId: string,
    type: "father" | "mother"
): Promise<ResponseType> => {
    const txn = dgraphInstance.newTxn()
    try {
        const mutation = new dgraph.Mutation()
        mutation.setSetJson({
            "dgraph.type": "Person",
            uid: personId,
            [`Person.${type}`]: { uid: parentId },
            [`${type}`]: parentId,
        })
        console.log("addParent json")

        await txn.mutate(mutation)
        await txn.commit()

        return {
            status: 200,
            success: true,
        }
    } catch (error) {
        console.error("/addParent - error", error)

        return {
            status: 500,
            success: false,
        }
    } finally {
        await txn.discard()
    }
}
