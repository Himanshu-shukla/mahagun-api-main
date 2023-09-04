import mongoose from "mongoose";
import config from "config";

const connectDB = () => {
  try {
    mongoose.connect(config.get("mongoURI"), {});
    console.log("MongoDB connected");
  } catch (error) {
    console.error(err.message);
    // Exit processs with failure
    process.exit(1);
  }
};

export { connectDB };
