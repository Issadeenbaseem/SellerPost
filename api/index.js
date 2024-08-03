import express from 'express';
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'
import cors from 'cors';
import cookieParser from 'cookie-parser'



dotenv.config();

mongoose.connect(process.env.MONGO_KEY).then(()=>{
    console.log('mongo connected successfully .... ')
}).catch((err)=>{
    console.log(err)
})
const app = express();

app.use(express.json());

app.use(cookieParser())

app.use(cors());


// Define routes

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);

//Error Middleware 

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({ message });
  });

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}!`);
});


