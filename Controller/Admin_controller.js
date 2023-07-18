var Admin = require('../model/Admin');
var Employee =require('../model/Employee');
const Review = require('../model/Review');
var Reviews = require('../model/Review');


module.exports.login = function(req,res){
    return res.render("login");
 }

 module.exports.signup = function(req,res){
    return res.render("Admin_signup")
}

module.exports.signupPost =  async function(req,res){
    console.log(req.body);
    if(req.body.password !== req.body.confirm_password){
        return res.redirect('back');

    }else{
        var email = req.body.email;
        var admin = await Admin.findOne({
            email:email
        })
        if(admin){
            return res.redirect("/admin/login_form");
        }
        else{
           await Admin.create({
            name:req.body.name,
            email:email,
            password:req.body.password,
            confirm_password:req.body.confirm_password
           })
           return res.redirect("/admin/login_form");
        }
    }
}
module.exports.SignInPost = function(req,res){
    
    return res.redirect('/admin/navbar');
}

module.exports.navbar = async (req,res) =>{
    if(req.isAuthenticated()){

        let employee = await Employee.findById(req.user.id);
        let review = await Reviews.findOne({sent : false});
        console.log(review);
        let email;
        if (review){

          let recipient = await Employee.findById(review.recipient);
          email = recipient.email;

        }
      
      


        if (employee){

           
            let feedbacks = await Employee.findById(req.user.id);
            let feed = [];
            for (let i = 0; i < feedbacks.Review.length; i++){

              let data = {};
              let review_1 = await Review.findById(feedbacks.Review[i]);
              let emp = await Employee.findById(review_1.reviewer);
              data.comment = review_1.review;
              data.reviewer = emp.email;
              feed.push(data);

            }
            return res.render('employee_dashboard',{
                name:employee.name,
                email:employee.email,
                id:employee.id,
                recipient : email,
                feed
             

            });
        }else{
            let admin = await Admin.findById(req.user.id);

            let temp = [];
            if (admin){

            for (let i = 0; i < admin.assignReview.length; i++){
                let employe = await Employee.findById(admin.assignReview[i]);
                let data = {};
                if (employe){
                     data.name = employe.name;
                     data.email = employe.email;
                     data.id = employe.id;
                     temp.push(data);
                }
            }

            return res.render('admin_dashboard',{
              employee : temp  
            })

        }

            
        }
     
       

    }
    else{
        return res.redirect('/admin/login_form');
    }
    //  return res.render('admin_dashboard');
    
}
module.exports.logout = async(req,res) =>{
    req.logout((err) => {
        if (err){
            console.log(err);
            return;
        }
    })
    return res.redirect('/admin/login_form');
}

module.exports.admin_profile = async function(req, res) {
    try {
        if (!req.user) {
            // Handle the case when user object is missing or undefined
            return res.status(400).send('User not found');
        }
        
        var data = await Admin.findById(req.user.id);
        return res.render('admin_profile.ejs', { name: data.name, email: data.email });
    } catch (err) {
        console.log(err);
    }
};
//add emplyee signup form
module.exports.Employee_signup = function(req,res){
         return res.render('add_employee');

}
//admin_dashboard
module.exports.admin_dashboard = async function(req,res){
   
        // return res.render('admin_dashboard',{
        //     employee : temp  
        //   });
        let admin = await Admin.findById(req.user.id);

        let temp = [];
        if (admin){

        for (let i = 0; i < admin.assignReview.length; i++){
            let employe = await Employee.findById(admin.assignReview[i]);
            let data = {};
            if (employe){
                 data.name = employe.name;
                 data.email = employe.email;
                 data.id = employe.id;
                 temp.push(data);
            }
        }
        console.log(temp);

        return res.render('admin_dashboard',{
          employee : temp  
        })

    }
    
   
}
//employee_login
//employee_dashboard
module.exports.employee_dashboard =async function(req,res){
     return res.render('employee_dashboard');
   
}

module.exports.AddEmployee = async function (req,res) {
    let employee = await Employee.findOne({email : req.body.email});
    if (employee){
        return res.redirect('/admin/admin_dashboard');
    }else{
         if (req.body.password === req.body.confirm_Password){
            employee = await Employee.create(req.body);

            let user = await Admin.findById(req.user.id);
            if (user){
                user.assignReview.push(employee.id);
                user.save();

            }

            return res.redirect('back');

         }else{
            return res.redirect('back');

         }
    }
}

// delelte the employee from admin_dashboard
module.exports.destroy = async (req, res) => {
    console.log(req.params);
    try {
        
      const { id } = req.params;
     
  
    //   // delete all the reviews in which this user is a recipient
    // //   await Review.deleteMany({ recipient: id });
  
    //   // delete all the reviews in which this user is a reviewer
    // //   await Review.deleteMany({ reviewer: id });
  
    //   // delete this user
      await Employee.findByIdAndDelete(id);
  
    //   req.flash('success', `User and associated reviews deleted!`);
      return res.redirect('back');
    } catch (err) {
      console.log('error', err);
      return res.redirect('back');
    }
  };

//assifn a review
module.exports.review_assign =  async (req, res) => {
    const { recipient_email } = req.body;
    console.log(recipient_email);
    try {
      if (req.isAuthenticated()) {
        const reviewer = await Employee.findById(req.params.id);
        const recipient = await Employee.findOne({ email: recipient_email });

       let review = await Reviews.create({
          reviewer : reviewer.id,
          recipient : recipient.id,
          sent : false
        });

        recipient.Review.push(review.id);
        recipient.save();

      

           

        
  
          
        return res.redirect('back');
      } else {
        // req.flash('error', `couldn't assign the review`);
      }
    } catch (err) {
      console.log('error: ', err);
    }
  };
  //edit_employee
  module.exports.edit_employee = async (req, res) => {
    try {
     
        //   populate employee with all the reviews (feedback) given by other users
        //   const employee = await Employee.findById(req.params.id).populate({
        //     path: 'reviewsFromOthers',
        //     populate: {
        //       path: 'reviewer',
        //       model: 'Employee',
        //     },
        //   });
           const{id} = req.params;
           var employee = await Employee.findById(id);
           let feed = [];
           for (let i = 0; i < employee.Review.length; i++){
              
            let data = {};

            let review = await Reviews.findById(employee.Review[i]);
            let employeee = await Employee.findById(review.reviewer);
            data.comment = review.review;
            data.reviewer = employeee.email;

            feed.push(data);


           }
  
          // extracting reviews given by others from employee variable
        //   const reviewsFromOthers = employee.reviewsFromOthers;
  
          return res.render('edit_employee',{
            employee:{
                name:employee.name,
                email:employee.email,
                feed
            }
          });
        
      
    //   return res.redirect('/');
    } catch (err) {
      console.log('error', err);
      return res.redirect('back');
    }
  };

  //submit_review
  module.exports.submit_review = async(req,res)=>{
    console.log(req.body);
    const { feedback } = req.body;
    try {
      
      

         let review = await Reviews.findOne({sent : false});
        if (review.reviewer == req.user.id){
          review.review = feedback;
          review.sent = true;
          review.save();
        }

     

  
     
      return res.redirect('back');
    } catch (err) {
      console.log('error', err);
    }
  }


  // update employee

  module.exports.Update = async (req,res) => {

    try{
      let employ = await Employee.findOne({email : req.body.email});

     for(let i = 0; i < employ.Review.length; i++){
      await Reviews.findByIdAndDelete(employ.Review[i]);
     }

      if(req.body.role == "Admin"){

         let password = employ.password;
         let name = employ.name;

         await Admin.create({
          name : name,
          password,
          email : req.body.email
         });


         await Employee.findOneAndDelete({email : req.body.email});

      
      }

    }catch(err){

      console.log(err);

    }

    return res.redirect('/admin/admin_dashboard');

   

  }