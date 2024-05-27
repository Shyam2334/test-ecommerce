import bcrypt from "bcrypt";
import IHashPassword from "../service/interface/hash.interface";

class HashPassword implements IHashPassword {
    async create(password: string) {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        return bcrypt.hash(password, salt);
    }

    async compare(password: string, hash: string) {
        return bcrypt.compare(password, hash);
    }
}

export default HashPassword;