import Router from "express";
import { UserAuthMiddleware } from "../middleware/user.js";
import { prisma } from "@repo/db/DatabaseClient";
const problemsRouter = Router();

problemsRouter.get("/getproblems" , async (req, res)=>{
    try{
        const GetProblems = await prisma.challenges.findMany({
            select : {
                id : true,
                title : true,
                description : true,
                difficulty : true,
                tags : true,
                slug : true,
            }
        });
        if(!GetProblems){
            return res.status(404).json({
                message : "No Problems Found",
                success : false
            })
        }
        res.status(200).json({
            message : "Problems Fetched Successfully",
            success : true,
            problems : GetProblems
        })

    }catch(e){
        console.log(e);
        return res.status(500).json({
            message : "Internal Server Error",
            success : false
        })
    }
});

//NOTE : Add UserAuthMiddleware to verify token and get user info  
problemsRouter.get("/getproblem/:slug"  , async (req, res)=>{
    const { slug } = req.params;
    try{
        const problem = await prisma.challenges.findFirst({
            where : { slug : slug as string},
            select: {
                id: true,
                title: true,
                description: true,
                difficulty: true,
                tags: true,
                examples: true,
                testcase: true,
                starterCode : true
            }
        });
        if (!problem) {
            return res.status(404).json({
                message: "Problem Not Found",
                success: false
            });
        }
        res.status(200).json({
            message: "Problem Fetched Successfully",
            success: true,
            problem
        });
    }catch(e){
        console.log(e);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
})




export default problemsRouter;