import mongoose from "mongoose";

const connectDB = async () => {
  try{
      await mongoose.connect(process.env.MONGODB_URL)
      console.log("DB Connected")
  }catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    throw error;
  }
};

export default connectDB;
