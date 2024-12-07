import { Request, Response } from "express"

import * as memberServices from "../services/member.services"

export const getAll = async (req: Request, res: Response) => {
    const result = await memberServices.getAll()
    return res.status(result.status).json(result.data)
}

export const create = async (req: Request, res: Response) => {
    const { firstName, lastName, gender } = req.body

    const result = await memberServices.create(firstName, lastName, gender)

    return res.status(result.status).json(result.data)
}

export const edit = async (req: Request, res: Response) => {
    const { id } = req.params
    const { firstName, lastName, gender } = req.body

    const result = await memberServices.edit(id, firstName, lastName, gender)

    return res.status(result.status).json(result.data)
}
