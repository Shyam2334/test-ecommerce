import { Response, Request } from "express";
import UserService from "../service/user.service";

class UserController {
    constructor(private readonly service: UserService) {}

    async register(req: Request, res: Response) {
        try {
            const user = await this.service.register(req.body);
            res.status(user.status).json(user.data);
        } catch (err) {
            res.status(500).json(err);
        }
    }
}

export default UserController;
