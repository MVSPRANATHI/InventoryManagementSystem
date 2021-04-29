const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const MongoClient=require('mongodb').MongoClient;

var db;
var s;
MongoClient.connect('mongodb://localhost:27017/Accessories',(err,database)=>{
    if(err) return console.log(err);
    db=database.db('Accessories')
    app.listen(5005,()=>{
        console.log('Listening at port number 5005')
    })
})
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.static('public'))

//Home page
app.get('/',(req,res)=> {
    db.collection('Watches').find().toArray((err,result)=>{
        if(err)return console.log(err)
        res.render('homepage.ejs',{data:result})
    })
})

app.get("/stockupdate",(req,res)=>{
    res.render('update.ejs')
})
app.get("/adddata",(req,res)=>{
    res.render('add.ejs')
})
app.get("/deletestock",(req,res)=>{
    res.render('delete.ejs')
})
//delete product 
app.post('/delete',(req,res)=>{
    db.collection('Watches').deleteOne({WatchId:req.body.WatchId},(err,result)=>{
        if(err)
        return console.log(err);
        console.log("item with product id"+req.body.WatchId+" is deleted")
        res.redirect('/')
})
})

//add new product to collection
app.post('/AddData',(req,res)=>{
    db.collection('Watches').save(req.body,(err,result)=>{
        if(err)
        return console.log(err);
        res.redirect('/')
    })
})

//update the stock
app.post('/update',(req,res)=>{
    db.collection('Watches').find().toArray((err,result)=>{
        if(err)
        return console.log(err)
for(var i=0;i<result.length;i++)
{
    if(result[i].WatchId==req.body.WatchId)
    {
        s=result[i].Stock;
        break;
    }
}
db.collection('Watches').findOneAndUpdate({WatchId:req.body.WatchId},{
    $set:{Stock:parseInt(s)+parseInt(req.body.Stock)}},{sort:{_id:-1}},
    (err,result)=>{
        if (err)
        return res.send(err)
        console.log(req.body.WatchId+' stock updated')
        res.redirect('/')
    })
})
})

