import Router from "express";
import { UserAuthMiddleware } from "../middleware/user.js";
import { prisma } from "@repo/db/DatabaseClient";
const problemsRouter = Router();

problemsRouter.get("/getproblems" , UserAuthMiddleware ,async (req, res)=>{
    try{
        const GetProblems = await prisma.contest.findMany();
        if(!GetProblems){
            return res.status(404).json({
                message : "No Problems Found",
                success : false
            })
        }
        res.status(200).json({
            message : "Problems Fetched Successfully",
            success : true,
            data : GetProblems
        })

    }catch(e){
        console.log(e);
        return res.status(500).json({
            message : "Internal Server Error",
            success : false
        })
    }
})


export default problemsRouter;