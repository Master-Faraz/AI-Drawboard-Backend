import mongoose from "mongoose";
import { DB_Name } from "../constants.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`,)
        console.log(`Mongo DB Connected to ${connectionInstance.connection.host}`);

    } catch (error) {
        console.error("Mongo DB Error: ", error.message);
    }
}

export default connectDB;