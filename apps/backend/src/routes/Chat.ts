import { Router } from "express";
import userAuthRouter from "./UserAuth.js";
import { GoogleGenAI } from "@google/genai";
import { GRIND_SYSTEM_PROMPT } from "../utils/GrindSystemPrompt.js";
import { prisma } from "@repo/db/DatabaseClient";
import { UserAuthMiddleware } from "../middleware/user.js";
import { get } from "http";
const grindaiRouter = Router();

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

grindaiRouter.post("/chat", UserAuthMiddleware , async (req, res) => {
  try {
    const { usermessage } = req.body;
     const userid = req.userId;
    const checkUserAIToken = await prisma.user.findFirst({
      where: { id: userid },
      select: { aitoken: true },
    });
    if (checkUserAIToken && checkUserAIToken.aitoken !== null && checkUserAIToken.aitoken !== undefined) {
      if (checkUserAIToken.aitoken < 0) {
        return res.status(403).json({
          message: "You Do Not Have Sufficent AI Credit",
          success: false,
        });
      }
    }

    const messageText =
      typeof usermessage === "string"
        ? usermessage
        : usermessage?.prompt ||
          usermessage?.text ||
          JSON.stringify(usermessage);

    if (!messageText || !messageText.trim()) {
      return res.status(401).json({
        message: "User Message Require",
        success: false,
      });
    }
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const responseStream = await genAI.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: messageText }] }],
      config: {
        systemInstruction: GRIND_SYSTEM_PROMPT,
      },
    });
    for await (const chunk of responseStream) {
      const text = chunk.text;
      if (text) {
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (e) {
    console.log(e);
    if (!res.headersSent) {
      return res.status(500).json({
        message: "Internal Server Error",
      });
    } else {
      res.write(`data: ${JSON.stringify({ error: "Stream error" })}\n\n`);
      res.end();
    }
  }
});

grindaiRouter.put("/update-user-credit", UserAuthMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const getUserCredit = await prisma.user.findFirst({
      where: { id: userId },
      select: { aitoken: true },
    });
    if(!getUserCredit){
      return res.status(404).json({
        message: "User Not Found",
        success: false,
      });
    }

    const UpdateUserCredit = await prisma.user.update({
      where: { id: userId },
      data: {
        aitoken: { decrement: 1 },
      },
    });

    if(UpdateUserCredit){
      return res.status(200).json({
        message: "User AI Credit Updated",
        credit: UpdateUserCredit.aitoken,
        maxcredit: getUserCredit.aitoken,
        success: true,
      });
    }
    
    return res.status(403).json({
      message: "Error While Updating User Credit",
      success: false,
    });

  }catch(e){
    console.log(e);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
})

grindaiRouter.post("/create-chat", UserAuthMiddleware, async (req, res) => {
  try {
    const { message } = req.body;
    const userid = req.userId;
    const checkUserAIToken = await prisma.user.findFirst({
      where: { id: userid },
      select: { aitoken: true },
    });
    if (checkUserAIToken && checkUserAIToken.aitoken !== null && checkUserAIToken.aitoken !== undefined) {
      if (checkUserAIToken.aitoken <= 0) {
        return res.status(403).json({
          message: "You Do Not Have Sufficent AI Credit",
          success: false,
        });
      }
    }

    const createUserMessage = await prisma.chatMessages.create({
      data: {
        userId: userid,
        message: message,
      },
    });

    await prisma.user.update({
      data: {
        aitoken: { decrement: 1 },
      },
      where: {
        id: userid,
      },
    });

    if (createUserMessage) {
      return res.status(200).json({
        message: "User Chat Created",
        chat: createUserMessage,
        success: true,
      });
    }

    return res.status(403).json({
      message: "Error While Creating your Chat",
      success: false,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
});
grindaiRouter.post("/create-chat-session", UserAuthMiddleware, async (req, res) => {
  try {
    const { message } = req.body;
    const userid = req.userId;
    const checkUserAIToken = await prisma.user.findFirst({
      where: { id: userid },
      select: { aitoken: true },
    });
    if (checkUserAIToken && checkUserAIToken.aitoken !== null && checkUserAIToken.aitoken !== undefined) {
      if (checkUserAIToken.aitoken <= 0) {
        return res.status(403).json({
          message: "You Do Not Have Sufficent AI Credit",
          success: false,
        });
      }
    }

    const createUserMessage = await prisma.chatMessages.create({
      data: {
        userId: userid,
        message: message,
      },
    });

    if (createUserMessage) {
      return res.status(200).json({
        message: "User Chat Created",
        chat: createUserMessage,
        success: true,
      });
    }

    return res.status(403).json({
      message: "Error While Creating your Chat",
      success: false,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
});

grindaiRouter.put("/update-chat/:id", UserAuthMiddleware, async (req, res) => {
  try {
    const { messageArray } = req.body;
    const userId = req.userId;
    const chatId = req.params.id;

    if (!chatId) {
      return res.status(401).json({
        message: "Missing Parameters Chat ID",
        success: false,
      });
    }

    if (!messageArray) {
      return res.status(401).json({
        message: "Chat Messages are Required",
        success: false,
      });
    }

    const updateUserChat = await prisma.chatMessages.update({
      data: {
        message: messageArray,
      },
      where: {
        id: chatId,
        userId: userId,
      },
    });

    if (updateUserChat) {
      return res.status(200).json({
        message: "User Chat Updated",
        chat: updateUserChat,
        success: true,
      });
    }
    return res.status(403).json({
      message: "Error While Updating your Chat",
      success: false,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
});

grindaiRouter.get("/get-chats", UserAuthMiddleware , async (req, res) => {
  try {
    const userId = req.userId;
    const getUserChats = await prisma.chatMessages.findMany({
      where: {
        userId: userId,
      },
    });
    if (getUserChats) {
      return res.status(200).json({
        message: "User Chats Fetched",
        chats: getUserChats,
        success: true,
      });
    }
    } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Internal Server Error",
        success: false,
    });
  }
});

grindaiRouter.post("/get-chats/:id", userAuthRouter, async (req, res) => {
  try {
    const userId = req.userId;
    const chatId = req.params.id;
    if (!chatId) {
      return res.status(401).json({
        message: "Chat ID is Required",
        success: false,
      });
    }
    const getUserChats = await prisma.chatMessages.findMany({
      where: {
        userId: userId,
        id: chatId,
      },
    });

    if (getUserChats) {
      return res.status(200).json({
        message: "User Chats Fetched",
        chats: getUserChats,
        success: true,
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
});


grindaiRouter.delete("/delete-chat/:id", UserAuthMiddleware , async (req, res) => {
  try {
    const userId = req.userId;
    const chatId = req.params.id;

    if (!chatId) {
      return res.status(401).json({
        message: "Chat ID is Required",
        success: false,
      });
    }
    const deleteUserChat = await prisma.chatMessages.deleteMany({
      where: {
        id: chatId,
        userId: userId,
      },
    });
    if (deleteUserChat) {
      return res.status(200).json({
        message: "User Chat Deleted",
        success: true,
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
});

export default grindaiRouter;
