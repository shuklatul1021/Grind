import dotenv from "dotenv";
import { app } from "./server.js";

dotenv.config();

const port = Number(process.env.PUBLISHER_PORT || 5001);

app.listen(port, () => {
  console.log(`Publisher is running on http://localhost:${port}`);
});
