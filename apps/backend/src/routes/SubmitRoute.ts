import Router from "express";
import { UserAuthMiddleware } from "../middleware/user.js";
import { cache } from "react";
const poblemsubmitRouter = Router();

poblemsubmitRouter.post("/problem" , UserAuthMiddleware ,async (req, res)=>{
    try{
        const problmeId = req.query.problemId;
        const { code , quation } = req.body;
        

    }catch(e){
        console.log(e);
        return res.status(500).json({
            message : "Internal Server Error",
            success : false
        })
    }
})



export default poblemsubmitRouter;