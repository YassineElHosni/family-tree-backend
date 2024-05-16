import dgraph from "dgraph-js"

import { ResponseType } from "../types/index.types"
import dgraphInstance from "../dgraph-instance"
import { addParent } from "./member.services"

export const getPartnershipAll = async (): Promise<ResponseType> => {
    try {
        const query = `
            query {
                all(func: type("Partnership")) {
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
        console.error("/getPartnershipAll - error", error)

        return {
            status: 500,
            success: false,
        }
    }
}

export const createPartnership = async (memberId1?: string, memberId2?: string): Promise<ResponseType> => {
    if (!memberId1 && !memberId2) {
        return {
            status: 400,
            success: false,
        }
    }

    const txn = dgraphInstance.newTxn()
    try {
        const partnership: any = {
            "dgraph.type": "Partnership",
            uid: "_:new-id",
        }

        if (memberId1) {
            partnership["Partnership.partner1"] = { uid: memberId1 }
            partnership.partner1 = memberId1
        }
        if (memberId2) {
            partnership["Partnership.partner2"] = { uid: memberId2 }
            partnership.partner2 = memberId2
        }

        const mutation = new dgraph.Mutation()
        mutation.setSetJson(partnership)

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
        console.error("/createPartnership - error", error)

        return {
            status: 500,
            success: false,
        }
    } finally {
        await txn.discard()
    }
}

export const getPartnershipById = async (id: string): Promise<ResponseType> => {
    try {
        const query = `
            query one($id: string) {
                one(func: uid($id)) @filter(type("Partnership")) {
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
        console.error("/getPartnershipById - error", error)

        return {
            status: 500,
            success: false,
        }
    }
}

export const deletePartnership = async (id: string): Promise<ResponseType> => {
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
        console.error("/deletePartnership - error", error)

        return {
            status: 500,
            success: false,
        }
    } finally {
        await txn.discard()
    }
}

export const addChildToPartnership = async (
    partnershipId: string,
    memberId: string,
    updateChild: boolean = false
): Promise<ResponseType> => {
    const txn = dgraphInstance.newTxn()
    try {
        const mutation = new dgraph.Mutation()
        mutation.setSetJson({
            "dgraph.type": "Partnership",
            uid: partnershipId,
            "Partnership.children": { uid: memberId },
            children: { uid: memberId },
        })

        await txn.mutate(mutation)
        await txn.commit()

        if (updateChild) {
            const response = await getPartnershipById(partnershipId)
            if (response) {
                const partnership: any = response.data
                if (partnership) {
                    if (partnership.partner1) {
                        await addParent(memberId, partnership.partner1, "father")
                    }
                    if (partnership.partner2) {
                        await addParent(memberId, partnership.partner2, "mother")
                    }
                }
            }
        }

        return {
            status: 200,
            success: true,
        }
    } catch (error) {
        console.error("/addChildToPartnership - error", error)

        return {
            status: 500,
            success: false,
        }
    } finally {
        await txn.discard()
    }
}
