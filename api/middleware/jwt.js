var jwt = require('jsonwebtoken');
var express = require('express');
require('dotenv').config()

module.exports = function checkJwt(req, res, next) {
    var token = req.cookies.token;
    try {
        var decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    } catch(err) {
        res.json({success: false, message: "Invalid Token"})
        return;
    }
    console.log(decoded.username)
    res.locals.tokenData = decoded;
    next()
}
