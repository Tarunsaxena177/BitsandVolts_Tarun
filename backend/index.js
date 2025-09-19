import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import path from "path";
import fs from "fs";

dotenv.config();

const app = express();
const __dirname = path.resolve(); // ✅ correct way in ES modules

// Ensure uploads folder exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use("/uploads", express.static(uploadsDir));


app.use("/api/users", userRoutes);


if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend", "dist")));

  // Wildcard route to serve React's index.html
  app.use((req, res, next) => {
    if (req.method === "GET" && !req.path.startsWith("/api")) {
      res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
    } else {
      next();
    }
  });
}


const PORT = process.env.PORT || 8000;
connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Startup error:", err);
    process.exit(1);
  });
