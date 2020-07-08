var mongoose=require("mongoose");
var dealerSchema=new mongoose.Schema({
    name:String,
    accountNumber:Number,
    IFSC:{
        type:String,
        default:'0'
    },
    bankName:String,
    date: {
        type: Date,
        default: Date.now
      }
    },
    { timestamps: true }
);

module.exports=mongoose.model("Dealer",dealerSchema);