import type { NextFunction , Response , Request } from "express";
import jwt from "jsonwebtoken"


export async function AdminAuthMiddleware(req : Request, res : Response, next : NextFunction){
    try{
        const token = req.headers.token as string;
        if(!token){
            return res.status(401).json({
                message : "Token Require",
                success : false
            });
        };
        const VerifySignedToken = await jwt.verify(token , process.env.ADMIN_SIGNED_JWT_TOKEN!);
        if(VerifySignedToken){
            //@ts-ignore
            req.userId = VerifySignedToken.id;
            return next();
        }
        return res.status(403).json({ 
            message : "Wrong Token",
            success : false
        });

    }catch(e){
        console.log(e);
        return res.status(500).json({
            message : "Internal Server Error"
        });
    };

}