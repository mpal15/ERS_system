var passport = require("passport");
var passport_local_strategy = require('passport-local').Strategy;
var Admin = require("../model/Admin");
let Employee = require('../model/Employee');

passport.use(new passport_local_strategy({usernameField:'email'},async function(email,password,done){
     try{
        var admin = await Admin.findOne({email:email});

        if (admin) {
            if (admin.password !== password) {
                return done(null,false);
            }else{
               
                return done(null,admin);

            }
            
        }else{
         
         let employee = await Employee.findOne({email : email});

         if (employee){
            if (employee.password === password){
                return done(null,employee);
            }else{
                return done(null,false);
            }
         }else{
            return done(null,false);
         }
            

             
        }
     }
     catch(err){
        console.log(err);
         return done(null,false);
     }
}))

passport.serializeUser(function(admin,done){
    return done(null,admin.email);
})
passport.deserializeUser(async function(email,done){
    var admin = await Admin.findOne({email:email});
    
    if(admin){
        return done(null,admin);

    }else{
        let employee = await Employee.findOne({email : email});
        if (employee){
            return done(null,employee);
        }else{
            return done(null,false);
        }
        
    }
})

passport.setAuthenticatedUser = async (req, res, next) => {
    if(req.user){
        let employee = await Employee.findById(req.user._id);
  
        if(!employee){
   
           if (req.isAuthenticated()) {
               res.locals.admin = req.user;
           }
   
       }

    }
  
   
    next();
};

// function checkAuthentication(req,res,next){
//     if(req.isAuthenticated()){
//         //req.isAuthenticated() will return true if user is logged in
//         next();
//     } else{
//         res.redirect("/admin/login_form");
//     }
// }

module.exports = passport