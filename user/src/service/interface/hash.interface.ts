interface IHashPassword {
    create(password: string): Promise<string>,
    compare(password: string, hash: string): Promise<boolean>
}

export default IHashPassword;