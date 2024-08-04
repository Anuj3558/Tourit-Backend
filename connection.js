import mongoose from "mongoose";

const connectToMongoDb = async (url) => {
    try {
        await mongoose.connect(url)
        console.log("MongoDB connected successfully");
    } catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1); 
    }
};

export default connectToMongoDb;
