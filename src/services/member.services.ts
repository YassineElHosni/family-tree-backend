import dgraph from "dgraph-js"

import { ResponseType } from "../types/index.types"
import dgraphInstance from "../dgraph-instance"
import { addChildToRelationship, getRelationshipById } from "./relationship.services"

export const getMemberAll = async (): Promise<ResponseType> => {
    try {
        const query = `
            query {
                all(func: type("Member")) {
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
                    relationships {
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
        console.error("/getMemberAll - error", error)

        return {
            status: 500,
            success: false,
        }
    }
}

export const createMember = async (
    firstName: string,
    lastName: string,
    gender: string,
    parentsRelationshipId?: string
): Promise<ResponseType> => {
    const txn = dgraphInstance.newTxn()
    try {
        const member: any = {
            "dgraph.type": "Member",
            uid: "_:new-id",
            "Member.firstName": firstName,
            "Member.lastName": lastName,
            "Member.gender": gender,
            firstName: firstName,
            lastName: lastName,
            gender: gender,
        }

        if (parentsRelationshipId) {
            const response = await getRelationshipById(parentsRelationshipId)

            const relationship: any = response.data

            if (relationship) {
                if (relationship.partner1) {
                    member["Member.father"] = { uid: relationship.partner1 }
                    member.father = relationship.partner1
                }
                if (relationship.partner2) {
                    member["Member.mother"] = { uid: relationship.partner2 }
                    member.mother = relationship.partner2
                }
            }
        }

        const mutation = new dgraph.Mutation()
        mutation.setSetJson(member)

        const response = await txn.mutate(mutation)
        await txn.commit()

        const memberId = response.getUidsMap().get("new-id")

        if (parentsRelationshipId) {
            await addChildToRelationship(parentsRelationshipId, memberId)
        }

        return {
            status: 200,
            success: true,
            data: {
                id: memberId,
            },
        }
    } catch (error) {
        console.error("/createMember - error", error)

        return {
            status: 500,
            success: false,
        }
    } finally {
        await txn.discard()
    }
}

export const getMemberById = async (id: string): Promise<ResponseType> => {
    try {
        const query = `
            query member($id: string) {
                member(func: uid($id)) {
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
            data: response.getJson().member[0],
        }
    } catch (error) {
        console.error("/getMemberById - error", error)

        return {
            status: 500,
            success: false,
        }
    }
}

export const updateMemberName = async (id: string, firstName: string, lastName: string): Promise<ResponseType> => {
    const txn = dgraphInstance.newTxn()
    try {
        const mutation = new dgraph.Mutation()
        mutation.setSetJson({
            "dgraph.type": "Member",
            uid: id,
            firstName,
            "Member.firstName": firstName,
            lastName,
            "Member.lastName": lastName,
        })

        await txn.mutate(mutation)
        await txn.commit()

        return {
            status: 200,
            success: true,
        }
    } catch (error) {
        console.error("/updateMemberName - error", error)

        return {
            status: 500,
            success: false,
        }
    } finally {
        await txn.discard()
    }
}

export const updateMemberRelationship = async (id: string, relationshipId: string): Promise<ResponseType> => {
    const txn = dgraphInstance.newTxn()
    try {
        const mutation = new dgraph.Mutation()
        mutation.setSetJson({
            "dgraph.type": "Member",
            uid: id,
            relationships: { uid: relationshipId },
            "Member.relationships": { uid: relationshipId },
        })

        await txn.mutate(mutation)
        await txn.commit()

        return {
            status: 200,
            success: true,
        }
    } catch (error) {
        console.error("/updateMemberRelationship - error", error)

        return {
            status: 500,
            success: false,
        }
    } finally {
        await txn.discard()
    }
}

export const addParent = async (
    memberId: string,
    parentId: string,
    type: "father" | "mother"
): Promise<ResponseType> => {
    const txn = dgraphInstance.newTxn()
    try {
        const mutation = new dgraph.Mutation()
        mutation.setSetJson({
            "dgraph.type": "Member",
            uid: memberId,
            [`Member.${type}`]: { uid: parentId },
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
