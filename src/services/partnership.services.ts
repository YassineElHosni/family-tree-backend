import dgraph from "dgraph-js"

import { ResponseType } from "../types/index.types"
import dgraphInstance from "../dgraph-instance"
import { addParent } from "./member.services"

export const getRelationshipAll = async (): Promise<ResponseType> => {
    try {
        const query = `
            query {
                all(func: type("Relationship")) {
                    uid
                    partner1 {
                        id
                    }
                    partner2 {
                        id
                    }
                    children {
                        uid
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
        console.error("/getRelationshipAll - error", error)

        return {
            status: 500,
            success: false,
        }
    }
}

export const createRelationship = async (memberId1?: string, memberId2?: string): Promise<ResponseType> => {
    if (!memberId1 && !memberId2) {
        return {
            status: 400,
            success: false,
        }
    }

    const txn = dgraphInstance.newTxn()
    try {
        const relationship: any = {
            "dgraph.type": "Relationship",
            uid: "_:new-id",
        }

        if (memberId1) {
            relationship["Relationship.partner1"] = { uid: memberId1 }
            relationship.partner1 = memberId1
        }
        if (memberId2) {
            relationship["Relationship.partner2"] = { uid: memberId2 }
            relationship.partner2 = memberId2
        }

        const mutation = new dgraph.Mutation()
        mutation.setSetJson(relationship)

        const response = await txn.mutate(mutation)
        await txn.commit()

        return {
            status: 200,
            success: true,
            data: {
                id: response.getUidsMap().get("new-id"),
            },
        }
    } catch (error) {
        console.error("/createRelationship - error", error)

        return {
            status: 500,
            success: false,
        }
    } finally {
        await txn.discard()
    }
}

export const getRelationshipById = async (id: string): Promise<ResponseType> => {
    try {
        const query = `
            query one($id: string) {
                one(func: uid($id)) @filter(type("Relationship")) {
                    uid
                    partner1 {
                        id
                        firstName
                        lastName
                    }
                    partner2 {
                        id
                        firstName
                        lastName
                    }
                }
            }
        `
        const vars = { $id: id }

        const response = await dgraphInstance.newTxn().queryWithVars(query, vars)

        return {
            status: 200,
            success: true,
            data: response.getJson().one[0],
        }
    } catch (error) {
        console.error("/getRelationshipById - error", error)

        return {
            status: 500,
            success: false,
        }
    }
}

export const deleteRelationship = async (id: string): Promise<ResponseType> => {
    const txn = dgraphInstance.newTxn()
    try {
        const mutation = new dgraph.Mutation()
        mutation.setDeleteJson({ uid: id })

        await txn.mutate(mutation)
        await txn.commit()

        return {
            status: 200,
            success: true,
        }
    } catch (error) {
        console.error("/deleteRelationship - error", error)

        return {
            status: 500,
            success: false,
        }
    } finally {
        await txn.discard()
    }
}

export const addChildToRelationship = async (
    relationshipId: string,
    memberId: string,
    updateChild: boolean = false
): Promise<ResponseType> => {
    const txn = dgraphInstance.newTxn()
    try {
        const mutation = new dgraph.Mutation()
        mutation.setSetJson({
            "dgraph.type": "Relationship",
            uid: relationshipId,
            "Relationship.children": { uid: memberId },
            children: { uid: memberId },
        })

        await txn.mutate(mutation)
        await txn.commit()

        if (updateChild) {
            const response = await getRelationshipById(relationshipId)
            if (response) {
                const relationship: any = response.data
                if (relationship) {
                    if (relationship.partner1) {
                        await addParent(memberId, relationship.partner1, "father")
                    }
                    if (relationship.partner2) {
                        await addParent(memberId, relationship.partner2, "mother")
                    }
                }
            }
        }

        return {
            status: 200,
            success: true,
        }
    } catch (error) {
        console.error("/addChildToRelationship - error", error)

        return {
            status: 500,
            success: false,
        }
    } finally {
        await txn.discard()
    }
}
