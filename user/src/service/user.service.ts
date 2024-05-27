import LoginUserDto from "../dao/login-user.dao";
import RegisterUserDto from "../dao/register-user.dao";
import IHashPassword from "./interface/hash.interface";
import IJwt from "./interface/jwt.interface";
import IUserRepository from "./interface/repository.interface";

class UserService {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly hashPassword: IHashPassword,
        private readonly jwt: IJwt
    ) {}

    async register(userDto: RegisterUserDto) {
        const foundUser = await this.userRepository.findByEmail(userDto.email);
        if (foundUser) {
            return {
                status: 409,
                data: "User already exists"
            }
        } else {
            const newPassword = await this.hashPassword.create(userDto.password);
            const newUser = {...userDto, password: newPassword};
            await this.userRepository.save(newUser);
            return {
                status: 201,
                data: newUser
            }
        }
    }

    async login(userDto: LoginUserDto) {
        const foundUser = await this.userRepository.findByEmail(userDto.email);
        if (!foundUser) {
            return {
                status: 404,
                data: "User not found"
            }
        }

        const isPasswordValid = await this.hashPassword.compare(userDto.password, foundUser.password);
        if (!isPasswordValid) {
            return {
                status: 401,
                data: "Invalid password"
            }
        }

        const token = this.jwt.sign({id: foundUser._id, admin: foundUser.admin});
        console.log(foundUser._id);
        return {
            status: 200,
            data: {
                user: foundUser,
                token: token
            }
        }
    }
}

export default UserService;
