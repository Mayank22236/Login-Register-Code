const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");


//Route for register
router.post("/register", async (req, res) => {
  //error handling
  try {
    const userExist = await User.findOne({ email: req.body.email });

    if (userExist) {
      return res.send({
        success: false,
        message: "User Already Exist",
      });
    }

    //password hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;
    console.log(salt);

    //create new user
    const newUser = await User(req.body);
    await newUser.save(); //save the data in the database

    res.send({
      success: true,
      MessageChannel: "User Registered Successfully",
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    console.log(user);

    if (!user) {
      return res.send({
        success: false,
        message: "You are not registered please register",
      });
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if (!validPassword) {
      return res.send({
        success: false,
        message: "Sorry, Invalid Password",
      });
    }

    const token = jwt.sign({userId: user._id}, `${process.env.SECRET_KEY}`, {expiresIn: "1d"});
   //console.log(token);
    res.send({
      success: true,
      user: user,
      message: "Login Successful",
      token : token
    });
  }
  catch (error) {
    console.log(error);
  }
});

router.get("/get-current-user", authMiddleware, async (req, res) => {
    const user = await User.findById(req.body.userId).select("-password");
    console.log(user);

  res.send({
    success: true,
    message: "User is Authorized for Protected Route",
    data: user
  });
})

module.exports = router;
