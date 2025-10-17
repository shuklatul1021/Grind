import  Router from "express";
import { AdminAuthSchema } from "../types/auth.js";
import { prisma } from "@repo/db/DatabaseClient";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { AdminAuthMiddleware } from "../middleware/admin.js";
import { UserAuthMiddleware } from "../middleware/user.js";

const adminAuthRouter = Router();


/**
 * SEEDING ADMIN ROUTE
 * This route is used to create an initial admin user for development purposes.
 * It should only be enabled in development mode to prevent unauthorized access in production.
 */
if(process.env.DEVELOPMENT_MODE==="development"){
    adminAuthRouter.post("/create-admin" , async(req, res)=>{
        try{
            const { email , password } = req.body;
            if(!email || !password){
                return res.status(411).json({
                    message : "Please Provide All Fields",
                    success : false
                })
            }
            const HashPassword = await bcrypt.hash(password , 5);
            const CreateAdmin = await prisma.admin.create({
                data : {
                    email : email,
                    password : HashPassword
                }
            });
            if(CreateAdmin){
                return res.status(200).json({
                    message : "Admin Created Successfully",
                    success : true
                })
            }
        }catch(e){
            console.log(e);
            res.status(500).json({
                message : "Internal Server Error",
                success : false
            })
        }
    })
}

/**@ADMIN_AUTH_ROUTE
 * The route to authenticate an admin user.
 * It expects the admin credentials in the request body and returns a JWT token upon successful authentication.
 */

adminAuthRouter.post("/auth" , AdminAuthMiddleware , async (req, res)=>{
    try{
        const { success , data } =  AdminAuthSchema.safeParse(req.body);
        if(!success){
            return res.status(411).json({
                message : "Plese Provide Credential in Valid Format",
                success : false
            })
        };
        const VerifyAdmin = await prisma.admin.findFirst({
            where : {
                email : data.email
            }
        });
        if(VerifyAdmin){
            const CheckPassword = await bcrypt.compare(data.password , VerifyAdmin.password);
            if(CheckPassword){
                const SignedToken = await jwt.sign({
                    id : VerifyAdmin.id
                }, process.env.ADMIN_SIGNED_JWT_TOKEN!)
                if(SignedToken){
                    return res.status(200).json({
                        message : "Admin Auth Successfully",
                        success : true,
                        token : SignedToken
                    });
                }
            };
        };
        res.status(411).json({
            message : "Wrong Credential try Again",
            success : false
        })
    

    }catch(e){
        console.log(e);
        res.status(500).json({
            message : "Internal Server Error",
            success : false
        })
    }
})

/**@ADMIN_CHALLENGE_ROUTE
 * The route to create a new challenge.
 * It expects the challenge details in the request body, parse and example/test case data and stores them in the database.
 * The route is protected by the UserAuthMiddleware to ensure only authenticated users can create challenges.
 */

adminAuthRouter.post("/set-challenges" , UserAuthMiddleware , async(req, res)=>{
    try{
        const { title , description , difficulty , tags , maxpoint , startercode , exampleinput , exampleoutput , explanation , testcaseinput , testcaseexpectedoutput } = req.body;
        if(!title || !description || !difficulty || !tags || !maxpoint || !startercode || !exampleinput || !exampleoutput){
            return res.status(411).json({
                message : "Please Provide All Fields",
                success : false
            })
        }
        const CreateChallenge = await prisma.challenges.create({
            data : {
                title: title,
                description: description,
                difficulty: difficulty,
                tags: tags,
                maxpoint: maxpoint,
                starterCode : startercode
            }
        });

        const CreateExample = await prisma.example.create({
            data : {
                input : exampleinput,
                output : exampleoutput,
                explanation : explanation,
                challengeId : CreateChallenge.id
            }
        });

        const CreateTestCase = await prisma.testCase.create({
            data : {
                input : testcaseinput,
                expectedOutput : testcaseexpectedoutput,
                challengeId : CreateChallenge.id
            }
        });

        if(CreateChallenge && CreateExample && CreateTestCase){
            return res.status(200).json({
                message : "Challenge Created Successfully",
                success : true
            })
        }

        return res.status(403).json({
            message : "Error While Creating Challeges",
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

adminAuthRouter.put("/update-challenge/:id" , UserAuthMiddleware , async(req, res)=>{
    try{
        const challengeId = req.params.id;
        const { exampleId , testCaseId } = req.query;
        const { title , description , difficulty , tags , maxpoint , startercode , exampleinput , exampleoutput , explanation , testcaseinput , testcaseexpectedoutput } = req.body;
        if(!title || !description || !difficulty || !tags || !maxpoint || !startercode || !exampleinput || !exampleoutput){
            return res.status(411).json({
                message : "Please Provide All Fields",
                success : false
            })
        }
        const UpdateChallenge = await prisma.challenges.update({
            where : {
                id : challengeId as string
            }, 
            data : {
                title: title,
                description: description,
                difficulty: difficulty,
                tags: tags,
                maxpoint: maxpoint,
                starterCode : startercode
            }
        });

        const UpdateExample = await prisma.example.update({
            where : {
                id : exampleId as string
            },
            data : {
                input : exampleinput,
                output : exampleoutput,
                explanation : explanation
            }
        });

        const UpdateTestCase = await prisma.testCase.update({
            where : {
                id : testCaseId as string
            },
            data : {
                input : testcaseinput,
                expectedOutput : testcaseexpectedoutput
            }
        });

        if(UpdateChallenge && UpdateExample && UpdateTestCase){
            return res.status(200).json({
                message : "Challenge Updated Successfully",
                success : true
            })
        }

        return res.status(403).json({
            message : "Error While Updating Challenge",
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

adminAuthRouter.delete("/delete-challenge/:id" , UserAuthMiddleware , async(req, res)=>{
    try{
        const challengeId = req.params.id;
        const DeleteChallenge = await prisma.challenges.delete({
            where : {
                id : challengeId as string
            }
        });

        if(DeleteChallenge){
            return res.status(200).json({
                message : "Challenge Deleted Successfully",
                success : true
            })
        }

        return res.status(403).json({
            message : "Error While Deleting Challenge",
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


/**@ADMIN_CONTEST_ROUTE
 * The route to create a new contest with associated challenges.
 * It expects the contest details and an array of challenge IDs in the request body, params and query and stores them in the database.
 * The route is protected by the UserAuthMiddleware to ensure only authenticated users can create contests.
 */

adminAuthRouter.post("/set-contest" , UserAuthMiddleware , async(req, res)=>{
    try{
        const { title , description , starttime , endtime , challengeids , type , status } = req.body;
        if(!title || !description || !starttime || !endtime || !challengeids || !type || !status){
            return res.status(411).json({
                message : "Please Provide All Fields",
                success : false
            })
        }
        
        const CreateContext = await prisma.contest.create({
            data : {
                title : title,
                description : description,
                startTime : new Date(starttime),
                endTime : new Date(endtime),
                type : type,
                status : status
            }
        });

        const ChallengeArray = challengeids.map((id: string)=> id);
        for(const challengeId of ChallengeArray){
            await prisma.contentToChallegesMapping.create({
                data : {
                    contestId : CreateContext.id,
                    challengeId : challengeId,
                    index : Math.floor(Math.random() * 1000)
                }
            })
        }

        if(CreateContext && ChallengeArray){
            return res.status(200).json({
                message : "Contest Created Successfully",
                success : true
            })
        }

        return res.status(403).json({
            message : "Error While Creating Contest",
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

adminAuthRouter.put("/update-contest/:id" , UserAuthMiddleware , async(req, res)=>{
    try{
        const contestId = req.params.id;
        const { title , description , starttime , endtime , newChallengeIds , contestToChallegesMappingId } = req.body;

        if(!title || !description || !starttime || !endtime || !newChallengeIds){
            return res.status(411).json({
                message : "Please Provide All Fields",
                success : false
            })
        }

        const UpdateContest = await prisma.contest.update({
            where : {
                id : contestId as string
            },
            data : {
                title : title,
                description : description,
                startTime : new Date(starttime),
                endTime : new Date(endtime)
            }
        });

        const ChallengeArray = newChallengeIds.map((id: string)=> id);
        for(const challengeId of ChallengeArray){
            await prisma.contentToChallegesMapping.upsert({
                where: { 
                    id : contestToChallegesMappingId
                },
                update: {
                    index: Math.floor(Math.random() * 1000)
                },
                create: {
                    contestId: contestId as string,
                    challengeId: challengeId,
                    index: Math.floor(Math.random() * 1000)
                }
            });
        }

        if(UpdateContest){
            return res.status(200).json({
                message : "Contest Updated Successfully",
                success : true
            })
        }

        return res.status(403).json({
            message : "Error While Updating Contest",
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

adminAuthRouter.delete("/delete-contest/:id" , UserAuthMiddleware , async(req, res)=>{
    try{
        const contestId = req.params.id;

        const DeleteContest = await prisma.contest.delete({
            where : {
                id : contestId as string
            }
        });

        if(DeleteContest){
            return res.status(200).json({
                message : "Contest Deleted Successfully",
                success : true
            })
        }

        return res.status(403).json({
            message : "Error While Deleting Contest",
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



export default adminAuthRouter;