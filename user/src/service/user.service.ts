import RegisterUserDto from "../dao/register-user.dao";
import IHashPassword from "./interface/hash.interface";
import IUserRepository from "./interface/repository.interface";

class UserService {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly hashPassword: IHashPassword
    ) {}

    async register(user: RegisterUserDto) {
        const foundUser = await this.userRepository.findByEmail(user.email);
        if (foundUser) {
            return {
                status: 409,
                data: "User already exists"
            }
        } else {
            const newPassword = await this.hashPassword.create(user.password);
            const newUser = {...user, password: newPassword};
            await this.userRepository.save(newUser);
            return {
                status: 201,
                data: newUser
            }
        }
    }
}

export default UserService;
