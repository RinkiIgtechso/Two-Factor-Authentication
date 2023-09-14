const express = require('express');
const router = express.Router();

// mongodb user model
const User = require("../models/User");
 
// Password handler
const bcrypt = require('bcrypt');
 
//signin
router.post('/signup', async (req, res) => {
    let {name, email, password, dateOfBirth} = req.body;
    name = name.trim();
    email =  email.trim();
    password = password.trim();
    dateOfBirth = dateOfBirth.trim();

    if(!name || !email || !password || !dateOfBirth){

        res.status(400).json({error: "All input is required!"})
    }else if(!/^[a-zA-Z ]*$/.test(name)){

        res.status(400).json({error:"Invalid name entered"})
    }else if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {

        res.status(400).json({error:"Invalid email entered"})
    }else if(!new Date(dateOfBirth).getTime()){

         res.status(400).json({error:"Invalid date of birth entered"})
    }else if(password.length<8){

        res.status(400).json({error:"Password is too short"})
    }

    try{
        let user = await  User.find({email:email});
        if(user.length>0){
            res.status(400).json({error: "User already exists!"})
        }else{
            const saltRounds = 10;
            let encryptPassword = await bcrypt.hash(password, saltRounds);
            const newUser = new User({
                name, email, password: encryptPassword, dateOfBirth
            });
            await newUser.save();
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
        console.log(user)
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

module.exports = router;