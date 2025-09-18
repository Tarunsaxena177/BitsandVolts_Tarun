import express from "express";
import upload from "../middleware/multer.js";
import {
  addUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  exportCsv,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/", upload.single("profileImage"), addUser);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", upload.single("profileImage"), updateUser);
router.delete("/:id", deleteUser);
router.get("/export/csv", exportCsv);

export default router;
