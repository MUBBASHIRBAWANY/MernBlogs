import express from "express";
import userModel, { comparePassword, getAuthontication,hashPassword } from "../modal/UserModal.js";
import  jwt  from "jsonwebtoken";

const User = userModel
export const userRegister = async (req,res)=>{
    try {
        const { name, email, password, admin} = req.body;
        const Userimage = req.files?.image[0]?.path;
       if (!name || !email || !password) {
           return res.status(400).send("All fields are required");
       }

       const hashPassword1 = await hashPassword(password);
       console.log(hashPassword1)
       const newUser = await User.create({
           name,
           email,
           password: hashPassword1,
           imageUrl: Userimage,
           Admin : admin? admin : false
       });

       const token = await getAuthontication(newUser);
       res.status(201).send({ message: "Registration successful", token });
   } catch (err) {
       console.error(err);
       res.status(500).send(`Server Error: ${err.message}`);
   }
}

export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email, password)
        if (!email || !password) {
            return res.status(400).send("All fields are required");
        }

        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(400).send("Invalid email or password");
        }

        const isValidPassword = await comparePassword(password, user.password);
        if (!isValidPassword) {
            return res.status(400).send("Invalid email or password");
        }

        const token = await getAuthontication(user);
        res.cookie("token", token);
        res.send({data:{
            status : "success",
            token : token
        }
    });
    } catch (err) {
        console.error(err);
        res.status(500).send(`Server Error: ${err.message}`);
    }
};
export const userProfile = async (req, res) => {
    console.log(req.body)
    
    try {
        const token = req.body.authorization
        
        if (!token) {
            return res.status(403).send("Invalid Token");
        }

        jwt.verify(token, "uber-Clone", (err, decoded) => {
            if (err) {
                return res.status(403).send("Invalid Token");
            }

            res.status(200).send({ status: true, data: decoded });
        });
    } catch (err) {
        console.error(err);
        res.status(500).send(`Server Error: ${err.message}`);
    }
};
