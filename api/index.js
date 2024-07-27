import express from 'express';
import mongoose from 'mongoose'
import dotenv from 'dotenv'


dotenv.config();
mongoose.connect(process.env.MONGO_KEY)

const app = express();

app.listen(3000,()=>{
        console.log("server running port 3000!")
})
