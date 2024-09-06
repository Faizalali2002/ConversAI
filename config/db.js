import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected To DataBase ${connect.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

export default connectDB;
