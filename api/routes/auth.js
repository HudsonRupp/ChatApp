var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var checkJwt = require('../middleware/jwt')
require('dotenv').config()


//temporary, will set up DB later
var accounts = []

router.post('/checkToken', checkJwt, function(req, res, next) {
  res.json({success: true, message: "Valid token for user: " + res.locals.tokenData.username})
})

router.post('/registration', function(req, res, next) {
  if(req.body.username == undefined || req.body.password == undefined) {
    res.json({success: false, message:"Invalid request body"})
    return
  }
  username = req.body.username;
  password = req.body.password;
  if(accounts.find(x => x.username==username)) {
    res.json({success: false, message: "User already exists"})
  } else {
    accounts.push({username: username, password: password})
    res.json({success: true, message: "Account successfully created"})
    console.log("signed up: " + username + " - " + password)
  }
});


router.post('/login', function(req, res, next) {
  if(req.body.username == undefined || req.body.password == undefined) {
    res.json({success: false, message:"Invalid request body"})
    return
  }
  username = req.body.username
  password = req.body.password
  var user;
  user = accounts.find(x => x.username==username)
  if (user == undefined || user.password != password) {
    res.json({success: false, message: "Invalid username/password"})
    return;
  }
  
  var token = jwt.sign({username: username}, process.env.TOKEN_SECRET)

  res.json({success: true, message:"successfully logged in", token: token})

});


module.exports = router;
