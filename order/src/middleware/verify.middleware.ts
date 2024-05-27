import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AuthRequest from "../dto/request.dto";

function verify(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    const jwtKey = process.env.JWT_KEY || 'secret';
    jwt.verify(token, jwtKey, (err: any, data: any) => {
        if (err) return res.sendStatus(403);
        req.user = data;
        next();
    });
}

export default verify;