import "./tracing.js";// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import path from "path";
import chatRoutes from "./routes/chatRoutes.js";

dotenv.config();
const app = express();
connectDB();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.get("/", (req, res) => res.send("API Running"));
app.use("/api/users", userRoutes);

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    message: "Moviehub backend is running",
    time: new Date().toISOString(),
  });
});

const uploadsPath = path.join(process.cwd(), "uploads");
app.use("/uploads", express.static(uploadsPath));

app.use("/api/chat", chatRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
