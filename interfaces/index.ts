export default interface IUser {
    email: string
    password: string
    userId: string
}

export default interface IRoom {
    category: string
    price: number
    status: number
    bedsQuantity: number
    area: number
    roomId: string
    isBooked: boolean
    description: string
}