export type UserType = {
    type?: "admin"
    email: string
    firstName: string
    lastName: string
    gender?: "female" | "male"
    birthday?: string
    phoneNumber?: {
        phone: string
        code: number
        short: string
    }
}
