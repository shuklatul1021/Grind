import express from "express"
import userAuthRouter from "./routes/UserAuth.js";
import adminAuthRouter from "./routes/AdminAuth.js";
import problemsRouter from "./routes/ProblemsRoute.js";
import poblemsubmitRouter from "./routes/SubmitRoute.js";
import { routeratelimiter } from "./limiter/RateLimiter.js";
import compilerRouter from "./routes/ComplierRoute.js";
import contestRouter from "./routes/ContestRouter.js";
import cors from "cors";
import { MatricsesMiddleware } from "./middleware/prometheus.js";
import client from "prom-client";
export const app = express();


app.use(express.json())
app.use(cors());
app.use(MatricsesMiddleware)
app.use(routeratelimiter);
  
app.use("/v1/api/user" , userAuthRouter);
app.use("/v1/api/admin" , adminAuthRouter);
app.use("/v1/api/problems" , problemsRouter);
app.use("/v1/api/contest" , contestRouter);
app.use("/v1/api/submit" , poblemsubmitRouter);
app.use("/v1/api/compiler" , compilerRouter);

app.get('/metrics', async (req, res) => {
    try{
        const metrics = await client.register.metrics();
        res.set('Content-Type', client.register.contentType);
        res.end(metrics);
    }catch(e){
        console.log(e);
        return res.status(500).json({
            message : "Internal Server Error",
            success : false
        })
    }
})