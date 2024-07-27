import express from 'express';
import mongoose from 'mongoose'
import dotenv from 'dotenv'


dotenv.config();

mongoose.connect(process.env.MONGO_KEY).then(()=>{
    console.log('mongo connected successfully .... ')
}).catch((err)=>{
    console.log(err)
})



const app = express();

app.listen(3000,()=>{
        console.log("server running port 3000!")
})
