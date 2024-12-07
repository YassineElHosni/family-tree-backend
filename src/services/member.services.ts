import dgraph from "dgraph-js"

import { ResponseType } from "../types/index.types"
import dgraphInstance from "../dgraph-instance"
import { addChildToRelationship } from "./relationship.services"

export const getAll = async () => {
    try {
        const query = `
            query {
                all(func: type("Member")) {
                    uid
                    id
                    firstName
                    lastName
                    gender
                    parentsRelationship
                    relationships {
                        uid
                        husband
                        wife
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
            data: response.getJson().all,
        }
    } catch (error) {
        console.error("/member.getAll - error", error)

        return {
            status: 500,
        }
    }
}

export const create = async (
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
            member["Member.parentsRelationship"] = { uid: parentsRelationshipId }
            member.parentsRelationship = parentsRelationshipId
        }
        console.log("/create - props", member)

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
        console.error("/create - error", error)

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

export const edit = async (id: string, firstName: string, lastName: string, gender: string): Promise<ResponseType> => {
    const txn = dgraphInstance.newTxn()
    try {
        const mutation = new dgraph.Mutation()
        mutation.setSetJson({
            "dgraph.type": "Member",
            uid: id,
            firstName,
            lastName,
            gender,
            "Member.firstName": firstName,
            "Member.lastName": lastName,
            "Member.gender": gender,
        })

        await txn.mutate(mutation)
        await txn.commit()

        return { status: 200 }
    } catch (error) {
        console.error("/member.edit - error", error)

        return { status: 500 }
    } finally {
        await txn.discard()
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

export const addParents = async (memberId: string, relationshipId: string): Promise<ResponseType> => {
    const txn = dgraphInstance.newTxn()
    try {
        const mutation = new dgraph.Mutation()
        mutation.setSetJson({
            "dgraph.type": "Member",
            uid: memberId,
            "Member.parentsRelationship": { uid: relationshipId },
            parentsRelationship: relationshipId,
        })

        await txn.mutate(mutation)
        await txn.commit()

        return {
            status: 200,
            success: true,
        }
    } catch (error) {
        console.error("/addParents - error", error)

        return {
            status: 500,
            success: false,
        }
    } finally {
        await txn.discard()
    }
}
