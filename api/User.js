const express = require('express');
const router = express.Router();
const User = require("../models/User"); // mongodb user model
const bcrypt = require('bcrypt'); // Password handler
const nodemailer = require("nodemailer"); // email handler
const {sendEmailVerification} = require("./mail")
require("dotenv").config(); // env variables

//signin
router.post('/signup', async (req, res) => {
    let {name, email, password, dateOfBirth} = req.body;
    name = name.trim();
    email =  email.trim();
    password = password.trim();
    dateOfBirth = dateOfBirth.trim();

    if(!name || !email || !password || !dateOfBirth){
        res.status(400).json({error: "All input is required!"})
    }

    try{
        let user = await  User.find({email:email});
        if(user.length>0){
            res.status(400).json({error: "User already exists!"})
        }else{
            const saltRounds = 10;
            let encryptPassword = await bcrypt.hash(password, saltRounds);
            const newUser = new User({
                name, email, password: encryptPassword, dateOfBirth, varified: false
            });
            await newUser.save();
            // handled account verification
            sendEmailVerification(newUser.email, newUser);
            res.status(200).json(newUser)
        }
    }catch(error){
        res.status(400).json({error})
    }
})

// SignIn
router.post('/signin', async (req, res) => {
    let { email, password } = req.body;
    email = email.trim();
    password = password.trim();

    try{
        const user = await User.findOne({email});

        if(user){
            const hashedPassword = user.password;
            const pass = await bcrypt.compare(password, hashedPassword);
            if(pass){
                res.status(200).json({message:"Login Successfull", user});
            }else{
                res.status(400).json({message: "Invalid password entered!"})
            }
        }else{
            res.status(400).json({message:'Uses not found!'})
        }
    }catch(err){
        res.status(400).json(err);
    }
})

router.get('/verify/:id', async (req, res) => {
    try{
        const user = await User.findOne({ _id: req.params.id });
        if(!user) res.status(400).send("Invalid Link!");

        await User.updateOne({email: user.email, verified: true});
        res.send("Email verified successfully!")
    }catch(err){
        res.status(400).send("An error occured!")
    }
})

module.exports = router;