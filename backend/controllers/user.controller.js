import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import path from "path";
import { createObjectCsvWriter as createCsvWriter } from "csv-writer";


export const addUser = async (req, res) => {
  try {
    const userData = req.body;


    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "mern_users",
      });
      userData.profileImage = result.secure_url;
      fs.unlinkSync(req.file.path); 
    } else {

      userData.profileImage =
        "https://res.cloudinary.com/demo/image/upload/v1734567890/default-avatar.png";
    }

    const user = new User(userData);
    await user.save();

    res.status(201).json(user);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(400).json({ message: error.message });
  }
};





export const getUsers = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page, 10) || 1;
    const lim = parseInt(limit, 10) || 10;

    const query = search
      ? {
          $or: [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { location: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * lim)
      .limit(lim);

    const total = await User.countDocuments(query);

    res.json({ users, total, page: pageNum, limit: lim });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateUser = async (req, res) => {
  try {
    const userData = req.body;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "mern_users",
      });
      userData.profileImage = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const user = await User.findByIdAndUpdate(req.params.id, userData, {
      new: true,
      runValidators: true,
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(400).json({ message: error.message });
  }
};

// Delete User
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const exportCsv = async (req, res) => {
  try {
    const users = await User.find().lean();

    const csvWriter = createCsvWriter({
      path: "users_export.csv",
      header: [
        { id: "_id", title: "ID" },
        { id: "firstName", title: "First Name" },
        { id: "lastName", title: "Last Name" },
        { id: "email", title: "Email" },
        { id: "mobile", title: "Mobile" },
        { id: "gender", title: "Gender" },
        { id: "userStatus", title: "Status" },
        { id: "location", title: "Location" },
        { id: "createdAt", title: "Created At" },
      ],
    });

    await csvWriter.writeRecords(users);

    res.download(path.join(process.cwd(), "users_export.csv"), "users.csv", (err) => {
      if (!err) {
        try {
          fs.unlinkSync(path.join(process.cwd(), "users_export.csv"));
        } catch {}
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
