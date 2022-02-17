var express=require("express");
var app= express();
var bodyParser=require("body-parser");
var mongoose = require("mongoose");
var cors=require("cors");
var flash=require("connect-flash");
var Player = require("./models/Player");

const PORT = process.env.PORT || 5000;

app.use(require("express-session")({
    secret:"my name is khan",
    resave:false,
    saveUninitialized:false
    }));
app.use(cors())

mongoose.set('useNewUrlParser',true);
mongoose.set('useUnifiedTopology',true);
mongoose.set('useFindAndModify',false);
mongoose.set('useCreateIndex',true);
mongoose.connect("mongodb+srv://fayeque123:fayeque123@devconnector-mxfos.mongodb.net/test?retryWrites=true&w=majority");
// mongoose.connect("mongodb://localhost/yelp_cam");
app.use(bodyParser.urlencoded({extended:true}));
app.use(flash());
app.use(express.static(__dirname + "/public"));
app.set("view engine","ejs");


app.use(function(req, res, next){
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
 });


 app.get("/",async (req,res) => {
    var players=await Player.find({}).sort({name:1});
    res.render('publicLanding',{players:players});
 })


app.get("/verysecureone",async (req,res) => {
        var players=await Player.find({}).sort({name:1});
        res.render('landing',{players:players});
});


app.get("/search",async (req,res) => {
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    var dealers=await Player.find({name:regex}).sort({"name":1}).lean();
    var noMatch;
    if(dealers.length < 1){
        noMatch="No Players found";
    }

    res.render('search',{players:dealers,noMatch:noMatch});
})
app.get("/addDealer",(req,res) => {
    res.render("addDealer");
});

app.post("/addDealer",async (req,res) => {
    var name=req.body.name;
  
    var player=await Player.create({name:name});
    await player.save();
    console.log(player);
    req.flash('success',"Player added successfully");
    res.redirect("/");
});

app.get("/handleWin/:pid",async (req,res) => {

    console.log(req.params.pid);
    const p=await Player.findOne({_id:req.params.pid});
    p.won+=1;
    p.matches+=1;
    p.history.won += 1;
    p.history.matches += 1;
    console.log(p);
    await p.save()
    res.json(p);
})

app.get("/handleLost/:pid",async (req,res) => {

    console.log(req.params.pid);
    const p=await Player.findOne({_id:req.params.pid});
    p.lost+=1;
    p.matches+=1;
    p.history.lost += 1;
    p.history.matches += 1;
    console.log(p);
    await p.save()
    res.json(p);
})

app.get("/handleMoM/:pid",async (req,res) => {

    console.log(req.params.pid);
    const p=await Player.findOne({_id:req.params.pid});
    p.Man_of_the_match+=1;
    console.log(p);
    await p.save()
    res.json(p);
})


app.get("/viewStats/:id",async (req,res) => {
    var p=await Player.findOne({_id:req.params.id});
    console.log(p);
    res.render("stats",{p:p});
})

app.get("/handlePay/:id",async (req,res) => {
    var player=await Player.findOne({_id:req.params.id});
    player.won=0;
    player.lost=0;
    player.matches=0;
    await player.save();
    console.log(player);
    res.redirect("/verysecureone");
})


app.get("/temp",async (req,res) => {
    var players=await Player.find({}).select({name:1,_id:1});
    console.log(players);
    res.send("Success");
})

app.get("/bulkinsert",async (req,res) =>{
    const players=await Player.insertMany([
        {name:'Saif Ali'},
        {name:'Fayeque'},
        {name:'Buni'},
        {name:'Aquib'},
        {name:'Chotu'},
        {name:'Sheru Bhai'},
        {name:'Sohrab Bhai'},
        {name:'Azad Bhai'},
        {name:'Atif'},
        {name:'Irfan'},
        {name:'Danish(Makkhi)'},
        {name:'Saddam Bhai'},
        {name:'Danish'},
        {name:'Sabbir Bhai'},
        {name:'Paale'},
        {name:'Faiz'},
        {name:'Raj Bhai'},
        {name:'Tutu Bhai'},
        {name:'Tipu Bhai'},
        {name:'Wajid Bhai'},
        {name:'Bikki'},
        {name:'Akil Bhai'}
    ]);

    // await players.save();
    res.send("Successfully");
})

app.get("/te",async (req,res) => {
    var p=await Player.find({}).select({name:1,_id:1}).sort({name:1});
    // console.log(p);
    const m=p.map((r) => {
        return {_id:r._id.toString(),name:r.name}
    });
    console.log(m);
    res.send("seee");
})


app.get("/updateBattingStats",async (req,res) => {
    var data=[
        { _id: '620be3bea9261146e0f043b8', name: 'Akil Bhai', runs: 13,ballsPlayed:8 },
        { _id: '620be3bea9261146e0f043a6', name: 'Aquib',runs: 10,ballsPlayed:12 },
        { _id: '620be3bea9261146e0f043ab', name: 'Atif',runs:0,ballsPlayed:0 },
        { _id: '620be3bea9261146e0f043aa', name: 'Azad Bhai',runs: 0,ballsPlayed:0 },
        { _id: '620be3bea9261146e0f043b7', name: 'Bikki', runs: 0,ballsPlayed:0 },
        { _id: '620be3bea9261146e0f043a5', name: 'Buni', runs: 1,ballsPlayed:2 },
        { _id: '620be3bea9261146e0f043a7', name: 'Chotu',runs: 0,ballsPlayed:0 },
        { _id: '620c4ad74b18020bbe14c392', name: 'Dablu Bhai',runs: 7,ballsPlayed:6},
        { _id: '620be3bea9261146e0f043af', name: 'Danish', runs: 41,ballsPlayed:20 },
        { _id: '620be3bea9261146e0f043ad', name: 'Danish(Makkhi)', runs: 0,ballsPlayed:0 },
        { _id: '620be3bea9261146e0f043b2', name: 'Faiz', runs: 0,ballsPlayed:0 },
        { _id: '620be3bea9261146e0f043a4', name: 'Fayeque',runs: 0,ballsPlayed:0 },
        { _id: '620be3bea9261146e0f043ac', name: 'Irfan', runs: 1,ballsPlayed:6 },
        { _id: '620be3bea9261146e0f043b1', name: 'Paale', runs: 0,ballsPlayed:0 },
        { _id: '620c52954b18020bbe14c394', name: 'Raj Bhagna', runs: 45,ballsPlayed:13 },
        { _id: '620be3bea9261146e0f043b3', name: 'Raj Bhai', runs: 11,ballsPlayed:10 },
        { _id: '620c527d4b18020bbe14c393', name: 'Rajji Bhai', runs: 11,ballsPlayed:5 },
        { _id: '620be3bea9261146e0f043b0', name: 'Sabbir Bhai', runs: 8,ballsPlayed:9 },
        { _id: '620be3bea9261146e0f043ae', name: 'Saddam Bhai', runs: 0,ballsPlayed:1 },
        { _id: '620be3bea9261146e0f043a3', name: 'Saif Ali',runs: 16,ballsPlayed:16 },
        { _id: '620c52be4b18020bbe14c396', name: 'Shakil Bhai',runs: 0,ballsPlayed:0 },
        { _id: '620be3bea9261146e0f043a8', name: 'Sheru Bhai',runs: 0,ballsPlayed:0 },
        { _id: '620be3bea9261146e0f043a9', name: 'Sohrab Bhai',runs: 9,ballsPlayed:7 },
        { _id: '620be3bea9261146e0f043b5', name: 'Tipu Bhai', runs: 6,ballsPlayed:5 },
        { _id: '620be3bea9261146e0f043b4', name: 'Tutu Bhai', runs: 4,ballsPlayed:8 },
        { _id: '620be3bea9261146e0f043b6', name: 'Wajid Bhai', runs: 0,ballsPlayed:0 },
        { _id: '620c52a54b18020bbe14c395', name: 'Zeeshan Bhai', runs: 2,ballsPlayed:7 }
      ]



      data.forEach(async (d) => {
        if(d.ballsPlayed > 0){
            var p=await Player.findById(d._id);
            p.runs =p.runs+d.runs;
            p.ballsPlayed=p.ballsPlayed+d.ballsPlayed;
            p.innings=p.innings+1;
            p.battingAverage = (p.runs / p.innings).toFixed(2);
            p.strikeRate=Math.floor((p.runs/p.ballsPlayed)*100);
            await p.save();
        }
      });

      res.send("Successfully");

});

// app.get("/initbattingavg",async (req,res) => {

//     // var p=await Player.updateMany({},{$set:{battingAverage:{$divide:['runs','innings']}}});
//     // res.send(p);

//     var data=[
//         { _id: '620be3bea9261146e0f043b8', name: 'Akil Bhai', runs: 13,ballsPlayed:8 },
//         { _id: '620be3bea9261146e0f043a6', name: 'Aquib',runs: 10,ballsPlayed:12 },
//         { _id: '620be3bea9261146e0f043ab', name: 'Atif',runs:0,ballsPlayed:0 },
//         { _id: '620be3bea9261146e0f043aa', name: 'Azad Bhai',runs: 0,ballsPlayed:0 },
//         { _id: '620be3bea9261146e0f043b7', name: 'Bikki', runs: 0,ballsPlayed:0 },
//         { _id: '620be3bea9261146e0f043a5', name: 'Buni', runs: 1,ballsPlayed:2 },
//         { _id: '620be3bea9261146e0f043a7', name: 'Chotu',runs: 0,ballsPlayed:0 },
//         { _id: '620c4ad74b18020bbe14c392', name: 'Dablu Bhai',runs: 7,ballsPlayed:6},
//         { _id: '620be3bea9261146e0f043af', name: 'Danish', runs: 41,ballsPlayed:20 },
//         { _id: '620be3bea9261146e0f043ad', name: 'Danish(Makkhi)', runs: 0,ballsPlayed:0 },
//         { _id: '620be3bea9261146e0f043b2', name: 'Faiz', runs: 0,ballsPlayed:0 },
//         { _id: '620be3bea9261146e0f043a4', name: 'Fayeque',runs: 0,ballsPlayed:0 },
//         { _id: '620be3bea9261146e0f043ac', name: 'Irfan', runs: 1,ballsPlayed:6 },
//         { _id: '620be3bea9261146e0f043b1', name: 'Paale', runs: 0,ballsPlayed:0 },
//         { _id: '620c52954b18020bbe14c394', name: 'Raj Bhagna', runs: 45,ballsPlayed:13 },
//         { _id: '620be3bea9261146e0f043b3', name: 'Raj Bhai', runs: 11,ballsPlayed:10 },
//         { _id: '620c527d4b18020bbe14c393', name: 'Rajji Bhai', runs: 11,ballsPlayed:5 },
//         { _id: '620be3bea9261146e0f043b0', name: 'Sabbir Bhai', runs: 8,ballsPlayed:9 },
//         { _id: '620be3bea9261146e0f043ae', name: 'Saddam Bhai', runs: 0,ballsPlayed:1 },
//         { _id: '620be3bea9261146e0f043a3', name: 'Saif Ali',runs: 16,ballsPlayed:16 },
//         { _id: '620c52be4b18020bbe14c396', name: 'Shakil Bhai',runs: 0,ballsPlayed:0 },
//         { _id: '620be3bea9261146e0f043a8', name: 'Sheru Bhai',runs: 0,ballsPlayed:0 },
//         { _id: '620be3bea9261146e0f043a9', name: 'Sohrab Bhai',runs: 9,ballsPlayed:7 },
//         { _id: '620be3bea9261146e0f043b5', name: 'Tipu Bhai', runs: 6,ballsPlayed:5 },
//         { _id: '620be3bea9261146e0f043b4', name: 'Tutu Bhai', runs: 4,ballsPlayed:8 },
//         { _id: '620be3bea9261146e0f043b6', name: 'Wajid Bhai', runs: 0,ballsPlayed:0 },
//         { _id: '620c52a54b18020bbe14c395', name: 'Zeeshan Bhai', runs: 2,ballsPlayed:7 }
//       ]

//       data.forEach(async (d) => {
//             var p=await Player.findById(d._id);
//             if(p.innings > 0){
//                 p.battingAverage = (p.runs/p.innings).toFixed(2);
//             }else{
//                 p.battingAverage = 0;
//             }
//             await p.save();
//       });

//       res.send("Successfully");

// })


app.get("/battingRestore",async (req,res) => {
    var p=await Player.updateMany({},{$set:{runs: 0,ballsPlayed:0,innings:0,strikeRate:0}});
    res.send("success");
})

app.get("/bowlingRestore",async (req,res) => {
    var p=await Player.updateMany({},{$set:{runsGiven: 0,ballsDelivered:0,wickets:0,ballInnings:0,overs:'',economy:0}});
    res.send("success");
})

app.get("/updateBowlingStats",async (req,res) => {

    var data=[
        { _id: '620be3bea9261146e0f043b8', name: 'Akil Bhai',runsGiven: 1,ballsDelivered:1,wickets:1},
        { _id: '620be3bea9261146e0f043a5', name: 'Buni',runsGiven: 24,ballsDelivered:18,wickets:4 },
        { _id: '620be3bea9261146e0f043b2', name: 'Faiz',runsGiven: 42,ballsDelivered:12,wickets:1 },
        { _id: '620be3bea9261146e0f043a4', name: 'Fayeque',runsGiven: 16,ballsDelivered:18,wickets:1},
        { _id: '620c52954b18020bbe14c394', name: 'Raj Bhagna',runsGiven: 39,ballsDelivered:18,wickets:0 },
        { _id: '620be3bea9261146e0f043b3', name: 'Raj Bhai',runsGiven: 28,ballsDelivered:18,wickets:2 },
        { _id: '620be3bea9261146e0f043b0', name: 'Sabbir Bhai',runsGiven: 20,ballsDelivered:12,wickets:1},
        { _id: '620be3bea9261146e0f043ae', name: 'Saddam Bhai',runsGiven: 18,ballsDelivered:18,wickets:1  },
        { _id: '620be3bea9261146e0f043a3', name: 'Saif Ali',runsGiven: 29,ballsDelivered:18,wickets:2 },
        { _id: '620be3bea9261146e0f043a8', name: 'Sheru Bhai',runsGiven: 0,ballsDelivered:0,wickets:0},
        { _id: '620be3bea9261146e0f043b5', name: 'Tipu Bhai',runsGiven: 0,ballsDelivered:0,wickets:0 }
      ]

      data.forEach(async (d) => {
        if(d.ballsDelivered > 0){
      var p=await Player.findOne({_id:d._id});
      p.runsGiven=p.runsGiven+d.runsGiven;
      p.ballsDelivered=p.ballsDelivered+d.ballsDelivered;
      p.ballInnings+=1;
      p.wickets=p.wickets+d.wickets;
      p.overs=`${Math.floor(p.ballsDelivered/6)}.${(p.ballsDelivered%6)}`;
      p.economy=(p.runsGiven/parseFloat(p.overs)).toFixed(2);
      await p.save();
        }
    });

    res.send("Successfully");
})

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


app.get("/battingStats",async (req,res) => {
    var data=await Player.find({}).sort({runs:-1});
    res.render("battingStats",{data:data});
});

app.get("/bowlingStats",async (req,res) => {
    var data=await Player.find({economy : {$gt : 0}}).sort({economy:1});
    res.render("bowlingStats",{data:data});
});

app.get("/battingAverage",async (req,res) => {
    var data=await Player.find({}).sort({battingAverage:-1});
    res.render("battingAverage",{data:data});
});


app.listen(PORT,() => console.log(`Server started at ${PORT}`));

//updateStatus
// app.get("/updateStatus/:t_id",async (req,res) => {
//     var tran=await Transaction.updateOne({_id:req.params.t_id},{$set:{pending:false}});
//     res.redirect("/");
// })

// app.get("/addTransaction/:dealer_id",async (req,res) => {
//     var dealer=await Dealer.findOne({_id:req.params.dealer_id},{"name":1});
//     console.log(dealer);
//     res.render("addTransaction",{dealer:dealer});
// })

// app.post("/addTransaction/:dealer_id",async (req,res) => {
//     console.log("req body",req.body);
//     var obj=req.body;
//     if(req.body.from){
//         obj.from=req.body.from.toLowerCase();
//     }
    
//     obj.dealer=req.params.dealer_id;
//     // console.log(obj);
//     var transaction = await Transaction.create(obj);
//     await transaction.save();
//     // console.log(transaction);
//     req.flash("success","Transaction added successfully");
//     res.redirect("/");
// });

// app.get("/viewTransactions/:dealer_id",async (req,res) => {
//     console.log(req.params.dealer_id);
//     await Transaction.find({dealer:req.params.dealer_id}).sort({createdAt:-1}).lean().populate("dealer","name accountNumber").select("dealer totalamount createdAt").exec((err,trans) => {
//         if(err){
//             console.log(err);
//         }
//         else{
//             var totalAmount=0;
//             trans.forEach((tran) => {
//                 totalAmount=totalAmount + parseInt(tran.totalamount);
//             });
            
//         function convert(x){
//         x=x.toString();
//         var lastThree = x.substring(x.length-3);
//     var otherNumbers = x.substring(0,x.length-3);
//     if(otherNumbers != '')
//         lastThree = ',' + lastThree;
//     var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
//     return res;
//     }

//     totalAmount=convert(totalAmount);

//             // console.log(trans);
//             res.render("viewTransaction",{transactions:trans,total:totalAmount});

//         }
//     });
// });

// app.get("/viewDetail/:trans_id",(async (req,res) => {
//     await Transaction.findOne({_id:req.params.trans_id}).populate("dealer","name accountNumber").exec((err,tran) => {
//         if(err){
//             console.log(err);
//         }
//         else{
//             // console.log(tran);
//             res.render("viewDetail",{t:tran});
//         }
//     })
// }));

// app.get("/showLimit",async (req,res) => {
//     console.log("here");
//     var tran=await Transaction.aggregate([
//         {$match:{"from":{$in:["fayeque","akil","adil"]}}},
//         {$group:{_id:{"from":"$from","date":{$month:"$date"}},"monthly":{$sum:{$toInt:"$totalamount"}},"dt":{$push:{"d":"$date","a":"$totalamount"}}}},
//         {$sort:{"_id.from":-1,"_id.date":1}}
//     ]);
//     // console.log("Here2",tran)
//         // {$lookup:{
//         //     from:"dealers",
//         //     localField:"_id.dealers",
//         //     foreignField:"_id",
//         //     as:"dealers_info"
//         // }}
        
//         // {$project:{_id:1,total:1,dealers:1,name:"$dealers_info.name",account:"$dealers_info.accountNumber"}}
//    if(tran.length < 1){
//        req.flash("error","No transaction yet");
//        return res.redirect("/");
//    }
//     // console.log(tran);
//     var obj={};
//     tran.forEach((t) => {
//         if(obj[t._id.from] == undefined){
//             obj[t._id.from]=t.monthly
//         }else{
//             obj[t._id.from]=obj[t._id.from]+t.monthly
//         } 
        
//     })
//     // console.log("obj",obj);
//     // console.log(typeof(tran[0].dates[0]));
//     // console.log(tran[1].dt);
//     // console.log(tran[2]._id.dealers);
//     // console.log(tran[1].dealers);
//     // res.redirect("/");

//     var mnth={
//         1:"January",
//         2:"February",
//         3:"March",
//         4:"April",
//         5:"May",
//         6:"June",
//         7:"July",
//         8:"August",
//         9:"September",
//         10:"October",
//         11:"November",
//         12:"December"
//     }
//     res.render("showLimit",{t:tran,obj:obj,month:mnth});
// });


// // app.get("/allTransactions",async (req,res) => {
// //     var tran= await Transaction.aggregate([
// //         {$group:{_id:{$month:"$date"},"monthly":{$sum:{$toInt:"$totalamount"}},"detail":{$push:{"d":"$dealer","a":"$totalamount","dt":"$date"}}}},
// //         {$lookup:{
// //             from:"dealers",
// //             localField:"detail.d",
// //             foreignField:"_id",
// //             as:"dealers_info"
// //         }},
// //         {$sort:{"detail.dt":-1}}
// //     ]);
// //     if(tran.length < 1){
// //         req.flash("error","No transaction yet");
// //         return res.redirect("/");
// //     }
// //     var total=0;
// //     var r={};
// //     tran.forEach((trn) => {
// //         trn.dealers_info.forEach((dealer) => {
// //             r[dealer._id.toString()]={"name":dealer.name,"bank":dealer.bankName};
// //         });

// //         trn.detail.forEach((de) => {
// //                     de["name"]=r[de.d].name;
// //                     de["bank"]=r[de.d].bank;
// //                 // r[de.d].transaction.push({"a":de.a,"d":de.dt});
// //             })
// //         total=total+trn.monthly;
// //     });
// //     // console.log("_-----------",r);
// //     // console.log(tran);
// //     // console.log(tran[0].detail);
// //     // console.log(tran[1].detail);
// //     // console.log(tran[0].dealers_info);
// //     var mnth={
// //         1:"January",
// //         2:"February",
// //         3:"March",
// //         4:"April",
// //         5:"May",
// //         6:"June",
// //         7:"July",
// //         8:"August",
// //         9:"September",
// //         10:"October",
// //         11:"November",
// //         12:"December"
// //     }

// //     res.render("allTransaction",{t:tran,total:total,month:mnth});
// // });

// app.get("/allTransactions",async (req,res) => {
//     console.log("Data from db");
//     // var tran= await Transaction.aggregate([
//     //     {$lookup:{
//     //         from:"dealers",
//     //         localField:"dealer",
//     //         foreignField:"_id",
//     //         as:"dealers_info"
//     //     }},
//     //     {$match:{"dealers_info":{$elemMatch:{"name":{$nin:["Fayeque hannan","Akil hannan","Adil hannan"]}}}}},
//     //     {$project:{
//     //         "date":1,
//     //         "totalamount":1,
//     //         "d_name":"$dealers_info.name",
//     //         "d_bank":"$dealers_info.bankName"
//     //       }},
//     //     {$group:{
//     //         _id: {$month:"$date"},
//     //         "monthly": {
//     //           $sum: {$toInt:"$totalamount"}
//     //         },
//     //         "details":{$push:{"d_name":"$d_name","d_bank":"$d_bank","a":"$totalamount","d":"$date"}}
//     //       }},
//     //     {$sort:{"_id":1}}
//     // ]);

//     var tran= await Transaction.aggregate([
//         {$lookup:{
//             from:"dealers",
//             localField:"dealer",
//             foreignField:"_id",
//             as:"dealers_info"
//         }},
//         {$match:{"dealers_info":{$elemMatch:{"name":{$nin:["Fayeque hannan","Akil hannan","Adil hannan"]}}}}},
//         {$project:{
//             "date":1,
//             "totalamount":1,
//             "d_name":"$dealers_info.name",
//             "d_bank":"$dealers_info.bankName"
//           }},
//         {$group:{
//             _id: {month:{$month:"$date"},year:{$year:"$date"}},
//             "monthly": {
//               $sum: {$toInt:"$totalamount"}
//             },
//             "details":{$push:{"d_name":"$d_name","d_bank":"$d_bank","a":"$totalamount","d":"$date"}}
//           }},
//         {$sort:{"_id.year":-1,"_id.month":-1}}
//     ]);
//     // console.log("Data from db",tran);
//     if(tran.length < 1){
//         req.flash("error","No transaction yet");
//         return res.redirect("/");
//     }

//     var total=0;
//     var season2=0;
//     var season1=0;
//     tran.forEach((t) => {
//         total=total+t.monthly
//         if((t._id.year == 2021 && t._id.month > 5) || (t._id.year == 2022 && t._id.month <= 5)){
//             season2=season2 + t.monthly;
//         }else{
//             season1=season1+t.monthly;
//         }
//     });

//     function convert(x){
//         x=x.toString();
//         var lastThree = x.substring(x.length-3);
//     var otherNumbers = x.substring(0,x.length-3);
//     if(otherNumbers != '')
//         lastThree = ',' + lastThree;
//     var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
//     return res;
//     }

//     total=convert(total);
//     season1=convert(season1);
//     season2=convert(season2);

//     console.log(total,season1,season2);
    
//     // console.log("_-----------",r);
//     // console.log(tran);
//     // console.log(tran[0].dealers_info[0]);
//     // console.log(tran[1].detail);
//     // console.log(tran[0].dealers_info);
//     var mnth={
//         1:"January",
//         2:"February",
//         3:"March",
//         4:"April",
//         5:"May",
//         6:"June",
//         7:"July",
//         8:"August",
//         9:"September",
//         10:"October",
//         11:"November",
//         12:"December"
//     }
    
//     // res.redirect("/");
//     res.render("allTransaction",{t:tran,total:total,month:mnth,s1:season1,s2:season2});
// });

// app.get("/edit/:dealer_id",async (req,res) => {
//     var dealer=await Dealer.findOne({_id:req.params.dealer_id}).lean();
//     console.log(dealer);
//     res.render("editDealer",{dealer:dealer});
// });

// app.post("/edit/:dealer_id",async (req,res) => {
//     var dealer=await Dealer.findByIdAndUpdate({_id:req.params.dealer_id},req.body);
//     await dealer.save();
//     // console.log(dealer);
//     req.flash('success',"Dealer info updated");
//     res.redirect("/");
// });

// app.get("/editDetail/:t_id",async (req,res) => {
//     var tran=await Transaction.findOne({_id:req.params.t_id}).populate("dealer","name accountNumber").lean();
//     // console.log(tran);
//     res.render("editTransaction",{t:tran});
// })
// app.post("/editDetail/:t_id",async (req,res) => {
//     var obj=req.body;
//     if(req.body.from){
//         obj.from=req.body.from.toLowerCase();
//     }
//     var tran= await Transaction.findByIdAndUpdate({_id:req.params.t_id},obj);
//     // console.log(tran);
//     await tran.save();
//     req.flash("success","Transaction updated successfully");
//     res.redirect("/");
// })

// app.get("/deleteDetail/:t_id",async (req,res) => {
//     await Transaction.findByIdAndDelete(req.params.t_id)
//     req.flash("success","Transaction deleted successfully");
//     res.redirect("/");
// })



