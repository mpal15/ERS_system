var express = require("express");
var route = express.Router();
var passport = require('passport');
var admin = require("../Controller/Admin_controller");
route.get("/login_form",admin.login);
route.get("/signup",admin.signup);
route.post("/signupPost",admin.signupPost);
route.post("/loginPost",passport.authenticate('local',{failureRedirect : '/admin/login_form'}),admin.SignInPost);
route.get('/navbar',admin.navbar);
route.get('/logout',admin.logout);
route.get('/admin_profile/',admin.admin_profile);
route.get('/employee_signup',admin.Employee_signup);
route.get('/admin_dashboard',admin.admin_dashboard);
route.get('/employee_dashboard',admin.employee_dashboard);
route.post('/Employee_signup',admin.AddEmployee);
route.get(`/destroy/:id`, admin.destroy);
route.post(`/assign-review/:id`,admin.review_assign);
route.get('/edit-employee/:id',admin.edit_employee);
route.post('/submit_review',admin.submit_review);
module.exports = route;