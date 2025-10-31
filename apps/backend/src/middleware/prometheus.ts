import type { NextFunction, Request, Response} from "express";
import { NumberOfRequestsCounter } from "../metrics/counter.js";
import { ActiveRequestsGauge } from "../metrics/gauge.js";
import { HttpsRequestDurationMicroseconds } from "../metrics/histrogram.js";


export const MatricsesMiddleware = async (req : Request, res : Response, next : NextFunction) =>{
    try{
        const startTime = Date.now();
        ActiveRequestsGauge.inc();
        res.on('finish' , ()=>{
            const endTime = Date.now();
            const responseTime = endTime - startTime;

            NumberOfRequestsCounter.inc({
                method : req.method,
                route : req.route ? req.route.path : req.path,
                status_code : res.statusCode
            });

            HttpsRequestDurationMicroseconds.observe({
                method: req.method,
                route: req.route ? req.route.path : req.path,
                code : res.statusCode
            } , responseTime);

            ActiveRequestsGauge.dec();
        })
        next();
    }catch(e){
        console.log(e);
        return res.status(500).json({
            message : "Internal Server Error",
            success : false
        })
    }
}