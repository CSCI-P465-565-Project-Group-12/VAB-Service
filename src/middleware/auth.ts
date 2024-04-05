import { jwtSecret } from "../app";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";


export const validateUserToken = (req: Request, res: Response, next:NextFunction) => {
    console.log("called validate user token")
    const token = req.headers.authorization?.split(" ")[1];
    console.log("token", token);
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token" });
        }
        req.user = user;
        next();
    });
}

export const validateVenueOwnerToken = (req: Request, res: Response, next:NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("token", token);
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token" });
        }
        console.log("user", user);
        req.user = user;
        next();
    });
};