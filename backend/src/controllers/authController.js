const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    try{
        const { name,email,password } = req.body;

        const existingUser = await User.findOne({ email });

        if(existingUser){
            return res.status(400).json({
                message: "user already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const user = await User.create({
            name,
            email,
            password:hashedPassword,
        });

        res.status(201).json({
            message:"user created successfully",
            user :{
                id: user._id,
                name: user.name,
                email: user.email,
                profileImage: user.profileImage,
            },
        });
    }catch (error){
        res.status(500).json({
            message: error.message,
        });
    }
};

const loginUser = async function(req,res){
    try{
        const { email,password } = req.body;

        const user = await User.findOne({ email });

        if(!user){
            return res.status(401).json({
                message: "invalid creds",
            });
        }

        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.status(401).json({
                message:"invalid creds",
            });
        }

        const token = jwt.sign(
            {
                userId: user._id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        res.json({
            message:"login successful",
            token,
        });
    }catch(error){
        res.status(500).json({
            message:error.message,
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
};