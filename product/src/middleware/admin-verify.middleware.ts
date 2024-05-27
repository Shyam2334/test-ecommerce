import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

function adminVerify(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    const jwtKey = process.env.JWT_KEY || 'secret';
    jwt.verify(token, jwtKey, (err: any, data: any) => {
        if (err) return res.sendStatus(403);
        if (!data.admin) return res.sendStatus(403);
        next();
    });
}

export default adminVerify;