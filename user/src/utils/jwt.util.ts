import jwt from "jsonwebtoken";
import IJwt from "../service/interface/jwt.interface";

class Jwt implements IJwt {
    sign(payload: object): string {
        const jwtKey = process.env.JWT_KEY || 'secret';
        return jwt.sign(payload, jwtKey, { expiresIn: '1h' });
    }
}

export default Jwt;