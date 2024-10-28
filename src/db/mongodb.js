import mongoose from "mongoose";

const connectMongodb = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URI}/${process.env.MONGODB_DATABASE_NAME}`
        );
        console.log(
            `MongoDB connected with server: ${connectionInstance.connection.host}`
        );
    } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`);
        process.exit(1);
    }
};

export default connectMongodb;
