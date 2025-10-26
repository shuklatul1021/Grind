import Router from "express";
import { UserAuthMiddleware } from "../middleware/user.js";
import { Sandbox } from '@e2b/code-interpreter';
import { ComilerRateLimiter } from "../limiter/RateLimiter.js";
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
 
poblemsubmitRouter.post("/submitcode" , ComilerRateLimiter , UserAuthMiddleware, async(req, res)=>{
    try{
        const { code, language, input } = req.body;
        
        if (!code || !language) {
            return res.status(400).json({
                message: "Please Provide All The Required Fields",
                success: false
            });
        }

        const supportedLanguages = ['python', 'javascript', 'typescript', 'java', 'cpp', 'c', 'go', 'rust'];
        if (!supportedLanguages.includes(language)) {
            return res.status(400).json({
                message: `Language '${language}' is not supported. Supported: ${supportedLanguages.join(', ')}`,
                success: false
            });
        }

        const sandbox = await Sandbox.create({
            apiKey: process.env.E2B_API_KEY!,
            timeoutMs: 60000 
        });

        let output = '';
        let error = '';
        let executionTime = 0;

        const startTime = Date.now();
        await sandbox.files.write('/tmp/main.py', code);
        const execution = await sandbox.commands.run(
            input ? `echo "${input}" | python3 /tmp/main.py` : 'python3 /tmp/main.py'
        );
        output = execution.stdout,
        error = execution.stderr,
        executionTime = Date.now() - startTime

        if(execution){
            return res.status(200).json({
                success: true,
                output,
                error,
                executionTime,
                language
            });
            
        }

        return res.status(403).json({
            message : "Error While Executeing Code",
            success : false,
            error,
            executionTime,
        })
    
    }catch(e){
        console.log(e);
        return res.status(500).json({
            message : "Internal Server Error",
            success : false
        })
    }
})



export default poblemsubmitRouter;