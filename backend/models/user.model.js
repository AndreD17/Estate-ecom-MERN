import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    avatar:{
        type: String,
        default: "https://www.google.com/imgres?q=&imgurl=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fthumbnails%2F005%2F544%2F718%2Fsmall_2x%2Fprofile-icon-design-free-vector.jpg&imgrefurl=https%3A%2F%2Fwww.vecteezy.com%2Ffree-vector%2Fprofile-icon&docid=RBpRIqik_jZCqM&tbnid=eKLh9kovO5Hp6M&vet=12ahUKEwj46Z-Bi6ePAxVGZ0EAHRqoCGAQM3oECBMQAA..i&w=400&h=400&hcb=2&itg=1&ved=2ahUKEwj46Z-Bi6ePAxVGZ0EAHRqoCGAQM3oECBMQAA"
    }
}, {timestamps: true});

const User = mongoose.model("User", userSchema);


export default User;