interface User {
    id?: string,
    name: string,
    email: string,
    password: string
    admin?: boolean
}

export default User;