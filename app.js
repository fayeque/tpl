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
        var players=await Player.find({});
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
    console.log(p);
    await p.save()
    res.json(p);
})

app.get("/handleLost/:pid",async (req,res) => {

    console.log(req.params.pid);
    const p=await Player.findOne({_id:req.params.pid});
    p.lost+=1;
    p.matches+=1;
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
    res.render("comingsoon");
})

// app.get("/bulkinsert",async (req,res) =>{
//     const players=await Player.insertMany([
//         {name:'Saif Ali'},
//         {name:'Fayeque'},
//         {name:'Buni'},
//         {name:'Aquib'},
//         {name:'Chotu'},
//         {name:'Sheru Bhai'},
//         {name:'Sohrab Bhai'},
//         {name:'Azad Bhai'},
//         {name:'Atif'},
//         {name:'Irfan'},
//         {name:'Danish(Makkhi)'},
//         {name:'Saddam Bhai'},
//         {name:'Danish'},
//         {name:'Sabbir Bhai'},
//         {name:'Paale'},
//         {name:'Faiz'},
//         {name:'Raj Bhai'},
//         {name:'Tutu Bhai'},
//         {name:'Tipu Bhai'},
//         {name:'Wajid Bhai'},
//         {name:'Bikki'},
//         {name:'Akil Bhai'}
//     ]);

//     await players.save();
//     res.send("Successfully");
// })

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


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



