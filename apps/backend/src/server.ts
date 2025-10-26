import express from "express"
import userAuthRouter from "./routes/UserAuth.js";
import adminAuthRouter from "./routes/AdminAuth.js";
import problemsRouter from "./routes/ProblemsRoute.js";
import poblemsubmitRouter from "./routes/SubmitRoute.js";
import { routeratelimiter } from "./limiter/RateLimiter.js";
import compilerRouter from "./routes/ComplierRoute.js";
import contestRouter from "./routes/ContestRouter.js";
import cors from "cors";
export const app = express();


app.use(express.json())
app.use(cors());
app.use(routeratelimiter)
  
app.use("/v1/api/user" , userAuthRouter);
app.use("/v1/api/admin" , adminAuthRouter);
app.use("/v1/api/problems" , problemsRouter);
app.use("/v1/api/contest" , contestRouter);
app.use("/v1/api/submit" , poblemsubmitRouter);
app.use("/v1/api/compiler" , compilerRouter);