import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/api/utils/db.js";
import userRoutes from './src/api/routes/user.routes.js';
import admintrainingRoutes from "./src/api/routes/admintraning.routes.js";
import usertrainingRoutes from "./src/api/routes/usertraning.routes.js";
import exerciseRoutes from "./src/api/routes/mainexercise.routes.js";
import subexerciseRoutes from "./src/api/routes/subexercises.routes.js";

dotenv.config(); 

const app = express();
app.get("/home",(req,res) =>{
    return res.status(200).json({message:"Server is running",
        success:true
    })
})
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));


const corsOptions = {
    origin: 'https://localhost:8000', 
    credentials: true
};
app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;

// Routes
app.use('/api/v1/users', userRoutes);
app.use("/api/v1/training", admintrainingRoutes);
app.use("/api/v1/user-training", usertrainingRoutes);
app.use("/api/v1/exercises", exerciseRoutes);
app.use("/api/v1/subexercises", subexerciseRoutes);






// Connect DB and start server
connectDB()
    .then(() => { 
        app.listen(PORT, () => {
            console.log(`Server running at port ${PORT}`);
        });
    })
    .catch(err => {
        console.error("Failed to connect DB:", err.message);
    });
                                                   