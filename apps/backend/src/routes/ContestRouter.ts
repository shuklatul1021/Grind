import { prisma } from "@repo/db/DatabaseClient";
import Router from "express";
const contestRouter = Router();


contestRouter.get("/getcontests" ,async (req, res)=>{
    try{
        const GetContests = await prisma.contest.findMany();
        if(!GetContests){
            return res.status(404).json({
                message : "No Contests Found",
                success : false
            })
        }
        return res.status(200).json({
            message : "Contests Fetched Successfully",
            success : true,
            contests : GetContests
        })
        
    }catch(e){
        console.log(e);
        return res.status(500).json({
            message : "Internal Server Error",
            success : false
        })
    }
})

contestRouter.get("/getcontest/:id" ,async (req, res)=>{
    const { id } = req.params;
    try{
        const contest = await prisma.contest.findUnique({
            where: { id: String(id) },
            include: {
                contestTochallegemapping : { include : { challenge : true } }
            }
        });
        if(!contest){
            return res.status(404).json({
                message : "Contest Not Found",
                success : false
            })
        }
        return res.status(200).json({
            message : "Contest Fetched Successfully",
            success : true,
            contest
        })
    }catch(e){
        console.log(e);
        return res.status(500).json({
            message : "Internal Server Error",
            success : false
        })
    }
})
export default contestRouter;