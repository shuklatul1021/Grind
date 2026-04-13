import cors from "cors";
import express from "express";
import compilerRouter from "./routes/compiler.js";

export const app = express();

app.use(cors());
app.use(express.json());

app.use("/v1/api/compiler", compilerRouter);

app.get("/health", (_req, res) => {
  return res.status(200).json({
    success: true,
    message: "Publisher healthy",
  });
});
