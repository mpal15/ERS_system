var mongoose = require("mongoose");
var EmployeeSchema  = new mongoose.Schema(
    {
        name:{
            type:String,
            require:true
        },
        email:{
            type:String,
            require:true
        },
        password:{
            type:String,
            require:true
        },
        Review:{
            type:[{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Review"
            }]
        },
        
    }
);

var Employee = mongoose.model('Employee',EmployeeSchema);
module.exports = Employee;