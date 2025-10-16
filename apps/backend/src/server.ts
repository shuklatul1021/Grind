import express from "express"
import userAuthRouter from "./routes/UserAuth.js";
import adminAuthRouter from "./routes/AdminAuth.js";
import problemsRouter from "./routes/ProblemsRoute.js";
import poblemsubmitRouter from "./routes/SubmitRoute.js";
import { routeratelimiter } from "./limiter/RateLimiter.js";
import compilerRouter from "./routes/ComplierRoute.js";
export const app = express();


app.use(express.json())
app.use(routeratelimiter)

app.use("/api/user" , userAuthRouter);
app.use("/api/admin" , adminAuthRouter);
app.use("/api/problems" , problemsRouter);
app.use("/api/submit" , poblemsubmitRouter);
app.use("/api/compiler" , compilerRouter);