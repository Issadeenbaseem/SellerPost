import mongoose from 'mongoose'


const userSchema = new mongoose.Schema({
        username:{
            type:String,
            unique:true,
            required:true
        },
        email:{
            type:String,
            unique:true,
            required:true,
        },
        avatar:{
            type:String,
            default:"https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="
        },

        password:{
            type:String,
            required:true,
        }
},{timestamps:true});

const User = mongoose.model('User',userSchema);

export default User;
