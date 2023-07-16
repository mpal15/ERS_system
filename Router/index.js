var express = require("express");
var route  = express.Router();
var Home = require("../Controller/home");
route.get("/",Home.home);

route.use("/admin",require('./admin'))
module.exports = route;