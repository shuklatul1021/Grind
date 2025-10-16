import Router from "express";
import { SignUpSchema } from "../types/auth.js";
import { OtpRateLimiter } from "../limiter/RateLimiter.js";
import { prisma } from "@repo/db/DatabaseClient";
import { Authsignal } from "@authsignal/node";
import jwt from "jsonwebtoken"
import dotenv from 'dotenv'
const userAuthRouter = Router();
dotenv.config()

const authsignal = new Authsignal({
  apiSecretKey: process.env.AUTH_SIGNAL_SECRATE_KEY!,
  apiUrl: process.env.AUTH_SIGNAL_API_URL!,
});

userAuthRouter.post("/sign-up" , async(req, res)=>{
    try{
        const { success , data } =  SignUpSchema.safeParse(req.body);
        if(!success){
            return res.status(401).json({
                message : "Plese Provide Right Credential And Try Again",
                success : false
            })
        }

        const request = {
            verificationMethod: "EMAIL_OTP" as "EMAIL_OTP",
            action: "signInWithEmail",
            email: data.email,
        };
        const response = await authsignal.challenge(request);
        const challengeId = response.challengeId;
        if(challengeId){
            return res.status(200).json({
                message : "Otp Sent To Your Email Address",
                challengeId : challengeId,
                success : true
            });
        };

    }catch(e){
        console.log(e);
        return res.status(500).json({
            message : "Internal Server Error",
            success : false
        });
    };
})

userAuthRouter.post("/verify-otp" , OtpRateLimiter , async(req, res)=>{
    try{
        const { otp , email , challengeId } = req.body;
        const otpSize  = otp.length;
        if(!otp && otpSize > 6){
            return res.status(411).json({
                message : "Plese Provide Valid Otp And Try Again"
            });
        };

        const VerifyRequest = {
            challengeId: challengeId,
            verificationCode: otp,
        }
        const response = await authsignal.verify(VerifyRequest);
        const isVerified = response.isVerified;

        if(!isVerified){
            return res.status(401).json({
                message : "Wrong Otp Try Again",
                success : false
            })
        }

        const StoreUserInfo = await prisma.user.upsert({
            create : { email : email },
            update : { },
            where : { email : email }
        });

        if(StoreUserInfo){
            const SignedToken = await jwt.sign({
                id : StoreUserInfo.id
            }, process.env.USER_AUTH_JSON_WEB_TOKEN!);
            if(SignedToken){
                return res.status(200).json({
                    message : "Authantication Successfully",
                    token : SignedToken,
                    success : true
                });
            };
        }
        return res.status(402).json({
            message : "Error While Authanticating",
            success : false
        })

    }catch(e){
        console.log(e);
        return res.status(500).json({
            message : "Internal Server Error",
            success : false
        })
    }
})


export default userAuthRouter;