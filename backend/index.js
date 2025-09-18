import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import path from "path";
import fs from "fs";

dotenv.config();

const app = express();


const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });


app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(uploadsDir));


app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 8000;
connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server runing on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Startup error:", err);
    process.exit(1);
  });
