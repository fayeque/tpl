var mongoose=require("mongoose");
var playerSchema=new mongoose.Schema({
    name:String,
    won:{type:Number,default:0},
    lost:{type:Number,default:0},
    matches:{type:Number,default:0},
    Man_of_the_match:{type:Number,default:0},
    avatar:{type:String,default:"https://cdn1.iconfinder.com/data/icons/sport-avatar-6/64/07-cricket_player-cricket-sports-avatar-people-512.png"},
    battingStats:[{runs:{type:Number,default:0},balls:{type:Number,default:0},date:{type:Date}}],
    bowlingStats:[{overs:{type:Number,default:0},runs:{type:Number,default:0},wickets:{type:Number,default:0},date:{type:Date}}],
    date: {
        type: Date,
        default: Date.now
      }
    },
    { timestamps: true }
);

module.exports=mongoose.model("Player",playerSchema);