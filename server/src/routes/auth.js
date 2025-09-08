const express = require("express");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const User=require("../models/User");

const router=express.Router();

//POST /signup
router.post("/signup",async(req,res)=>{
    try{
        const {email,username,password}=req.body;
        if(!email||!username||!password){
            return res.status(400).json({message:"All fields are required"});
        }
        const existing=await User.findOne({email});
        if(existing){
            return res.status(400).json({message:"User already exists"});
        };

        const passwordHash=await bcrypt.hash(password,10);
        const user=new User({email,username,passwordHash});
        await user.save();
        res.json({message:"User created successfully"});
    }
    catch(err){
        res.status(500).json({message:"Signup failed.."});
    }
});

//POST /Login
router.post("/login",async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email||!password){
            return res.status(400).json({message:"All fields are required"});
        }
        const user=await User.findOne({email});
        if(!user) return res.status(400).json({message:"Invalid credentials"});
        const valid=await bcrypt.compare(password,user.passwordHash);
        if(!valid) return res.status(400).json({message:"Invalid credentials"});
        const token=jwt.sign(
            {id:user._id,email:user.email},
            process.env.JWT_SECRET,
            {expiresIn:"1d"}
        );
        res.cookie("token",token,{httpOnly:true,sameSite:"Strict",secure:process.env.NODE_ENV==="production",maxAge:24*60*60*1000});

        res.json({user:{id:user._id,username:user.username,email:user.email}});
    }
    catch(err){
        res.status(500).json({message:"Login failed.."});
    }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});


module.exports=router;