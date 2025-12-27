import { prisma } from "@repo/db/DatabaseClient";
import Router from "express";
import z from "zod";
const feedbackRouter = Router();

  const feedbackSchema = z.object({
    fullname: z.string(),
    email: z.string().email(),
    subject: z.string(),
    messages : z.string()
});

feedbackRouter.post("/submit", async (req, res) => {
    try{
        const { success , data } = feedbackSchema.safeParse(req.body);
        if(!success){
            return res.status(400).json({ error: "Invalid input" , success: false});
        }

        const createFeedback = await prisma.userFeedback.create({
            data: {
                fullname: data.fullname,
                email: data.email,
                subject: data.subject,
                messages : data.messages
            }
        });

        if(!createFeedback){
            return  res.status(400).json({ error: "Failed to submit feedback" , success: false});
        }

        return res.status(201).json({ message: "Feedback submitted successfully" , success: true});

    }catch(error){
        res.status(500).json({ error: "Internal Server Error" , success: false});
    }
});







export default feedbackRouter;