const mongoose = require("mongoose");

const MONGO_URL = "mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/user_role_db?retryWrites=true&w=majority";

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("MongoDB Atlas Connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

module.exports = connectDB;