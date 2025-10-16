import  Router from "express";
import { AdminAuthSchema } from "../types/auth.js";
import { prisma } from "@repo/db/DatabaseClient";
import bcrypt from "bcrypt"
const adminAuthRouter = Router();

adminAuthRouter.post("/auth" , async (req, res)=>{
    try{
        const { success , data } =  AdminAuthSchema.safeParse(req.body);;
        if(!success){
            return res.status(411).json({
                message : "Plese Provide Credential in Valid Format",
                success : false
            })
        };
        const VerifyAdmin = await prisma.admin.findFirst({
            where : {
                email : data.email
            }
        });
        if(VerifyAdmin){
            const CheckPassword = await bcrypt.compare(data.password , VerifyAdmin.password);
            if(CheckPassword){
                return res.status(200).json({
                    message : "Admin Auth Successfully",
                    success : true
                });
            }
        }
        res.status(411).json({
            message : "Wrong Credential try Again",
            success : false
        })
    

    }catch(e){
        console.log(e);
        res.status(500).json({
            message : "Internal Server Error",
            success : false
        })
    }
})


export default adminAuthRouter;