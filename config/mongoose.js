var mongoose = require("mongoose");
mongoose.connect("mongodb+srv://mohitpal9513:mpal9513@cluster0.gbojmyb.mongodb.net/ERS_System?retryWrites=true&w=majority")
.then(()=>{
    console.log("database connected suceefully");
},(err)=>{
    console.log("error is occured",err)
})
