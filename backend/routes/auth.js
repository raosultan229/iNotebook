const express= require ('express');
const router= express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');

const JWT_SECRET="SultanLoveayesha"

    // ROUTE 1: Creaing a User using: POST "/api/auth/createuser"

router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password','Password must be at least 5 chars').isLength({ min: 5 }),
    ],async (req, res)=>{ 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try{
    let user = await User.findOne({email: req.body.email});
    if (user){
      return res.status(400).json({error: "User with this email already exist"})
    }

    const salt = await bcrypt.genSaltSync(10);
    const secPass = await bcrypt.hashSync(req.body.password, salt);

      // Creating new user
     user= await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      })
      const data={
        user:{
          id: user.id
        }
      }

      const authtoken = jwt.sign(data, JWT_SECRET)
      // res.json({user})
      res.json({authtoken})
    } catch (error){
      console.error(error.message);
      res.status(500).send("We caught error")
    }
  })

    // ROUTE 2: Authenticate a User using: POST "/api/auth/login"
    router.post('/login', [
      body('email', 'Enter a valid email').isEmail(),
      body('password','Password cannot be blank.').exists(),
      ],async (req, res)=>{ 

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()});
      }
    
      const {email,password}= req.body;
      try {
        let user= await User.findOne({email});
        if(!user){
          return res.status(400).json({error: "Please enter valid credentials"})
        }
        const passwordCompare= await bcrypt.compare(password, user.password);
        if(!passwordCompare){
          return res.status(400).json({error: "Please enter valid credentials"})
        }
        const data={
          user:{
            id: user.id
          }
        }

      const authtoken = jwt.sign(data, JWT_SECRET)
      res.json({authtoken})
      
    } catch (error){
      console.error(error.message);
      res.status(500).send("Internal server issue.");
    }
  
})

    // ROUTE 3: Get login details of users using: POST "/api/auth/getuser"
    router.post('/getuser',fetchuser, async (req, res)=>{ 
        try {
        userId= req.user.id;
        const user= await User.findById(userId).select("-password")
        res.send(user)
        } catch (error){
          console.error(error.message);
          res.status(500).send("Internal server issue.");
        }
      })
module.exports = router