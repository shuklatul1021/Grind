import Router from "express";
import { UserAuthMiddleware } from "../middleware/user.js";
const problemsRouter = Router();

problemsRouter.get("/getproblems" , UserAuthMiddleware ,async (req, res)=>{
    try{

    }catch(e){
        console.log(e);
        return res.status(500).json({
            message : "Internal Server Error",
            success : false
        })
    }
})


export default problemsRouter;