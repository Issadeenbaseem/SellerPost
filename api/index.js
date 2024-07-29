import express from 'express';
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'


dotenv.config();

mongoose.connect(process.env.MONGO_KEY).then(()=>{
    console.log('mongo connected successfully .... ')
}).catch((err)=>{
    console.log(err)
})
const app = express();
app.use(express.json());

// Define routes
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);

//Error Middleware 

app.use((err,req,res,next) =>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error ...'

    return res.status(statusCode).json({
        success:false,
        statusCode,
        message
    })
}) 

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}!`);
});


