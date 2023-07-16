var mongoose = require("mongoose");
var AdminSchema  = new mongoose.Schema(
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
        assignReview:{
            type:[{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Employee"
            }]
        },
    }
);

var Admin = mongoose.model('Admin',AdminSchema);
module.exports = Admin;