import * as AuthServices from "../services/auth.services"

export const Signup = async (req, res) => {
    const { email, password } = req.body

    const result = await AuthServices.Signup(email, password)

    res.status(result.status).json(result)
}

export const Login = async (req, res) => {
    const { email, password } = req.body

    const result = await AuthServices.Login(email, password)

    res.status(result.status).json(result)
}
