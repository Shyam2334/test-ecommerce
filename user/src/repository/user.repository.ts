import User from "../domain/user.domain";
import { UserModel } from "../model/user.model";
import IUserRepository from "../service/interface/repository.interface";

class UserRepository implements IUserRepository {
    async save(user: User) {
        const newUser = new UserModel(user);
        await newUser.save();
        return newUser;
    }

    async findByEmail(email: string) {
        return UserModel.findOne({ email });
    }
}

export default UserRepository;