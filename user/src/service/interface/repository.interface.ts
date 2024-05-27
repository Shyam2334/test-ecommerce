import User from "../../domain/user.domain";

interface IUserRepository {
    save(user: User): Promise<User>,
    findByEmail(email: string): Promise<User & { _id: unknown } | null>
    findById(id: string): Promise<User | null>
}

export default IUserRepository;