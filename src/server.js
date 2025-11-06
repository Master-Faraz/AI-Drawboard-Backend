import 'dotenv/config'
import app from "./app.js";
import connectDB from "./database/db.js";

const PORT = process.env.PORT;

// Connect to Database
connectDB()
    .then(() => {
        // Event Error handling 
        app.on('error', (err) => {
            console.error("Express Server Error: ", err);
        });

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.Error("MongoDB Connection Failed: ", err);
    })

