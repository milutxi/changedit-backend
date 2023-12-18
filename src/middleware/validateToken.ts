import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import User from "../models/User";

const validateToken =(req: Request, res: Response, next: NextFunction) => {

    // Söker efter en Authorization header
    const authHeader = req.headers['authorization']

    // authorization ser ut såhär : Bearer asdolgsdlkjg8097uje
    
    // Läser ut JWT
    //skriv kort vad här är
    const token = authHeader && authHeader.split(' ')[1]

    if(!token) {
        return res.status(401).json({message: "Not authenticated"});
    }

    const secret = process.env.JWT_SECRET;
        if(!secret) {
            throw Error('Missing JWT_SECRET');
        }

    // Kolla att JWTn är giltig

    // Läsa ut användar id från token
    jwt.verify(token, secret, (error, decodedPayload: any) => {
        if (error || !decodedPayload || typeof decodedPayload === 'string') {
         console.log(error)
           return res.status(403).json({message: 'Not authorized'});
           
        }
        if (!User.exists({_id: decodedPayload.userId})) {
            return res.status(403).json({message: 'Not authorized'})
        }
        //Lägga till userId på req
        req.userId = decodedPayload.userId
        next()
    })
    
}

export default validateToken;