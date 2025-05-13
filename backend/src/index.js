import express from "express";
import authRouter from "./routes/auth.route.js";
import messageRouter from "./routes/message.route.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import { erroHandler } from "./middleware/errorMiddleware.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import initSocket from "./socket.js";
import path from "path";
dotenv.config();

const app = express();

const PORT = process.env.PORT;
const __dirname = path.resolve();
const NODE_ENV = process.env.NODE_ENV;
const server = http.createServer(app);


app.use(
  cors({
    origin: ["http://localhost:3001", "http://localhost:3000","http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

initSocket(server);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);

if(NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });
}

app.use(erroHandler);

server.listen(PORT, async () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  await connectDB();
});