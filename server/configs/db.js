import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            serverSelectionTimeoutMS: 15000,
            socketTimeoutMS: 45000,
        };

        cached.promise = mongoose.connect(`${process.env.MONGODB_URI}/greencart`, opts).then((mongoose) => {
            console.log("Database Connected");
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        console.error("Database connection error:", error.message);
        throw error;
    }
    return cached.conn;
};

export default connectDB;