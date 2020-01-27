var express=require('express')
var session=require('express-session')
var mongoose=require('mongoose')
var cors=require('cors')
var path = require('path')
var app=express()
var config=require('./config/database')

mongoose.connect(config.database)
var db=mongoose.connection

db.once('open',()=>{
	console.log("Connection established with mongo")
})
db.on('error', (err)=>{
	console.log(err);
})

app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'public')));
var Users=require('./models/users')
var addressBooks=require('./models/book')

app.use(session({
	'secret':'AB1234'
}));

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs')

var auth=(req,res,next)=>{
	if(req.session.isLogin){
		next();
	}else{
		res.redirect('/login')
	}
}

app.get('/register',(req,res)=>{
    res.render('register')
})

app.get('/login',(req,res)=>{
	res.render('login')
})

app.get('/home',auth,(req,res)=>{
	Users.findOne({email:req.session.user},(err,user)=>{
		addressBooks.find({myemail:req.session.user},(err,book)=>{
			res.render('home',{
				user:user,
				book:book
			})
		})
	})
})

app.get('/editdata/:id',(req,res)=>{
	addressBooks.findOne({_id:req.params.id},(err,book)=>{
		res.render('editdata',{
			book:book
		})
	})
})
app.get('/addname',(req,res)=>{
	res.render('addname')
})

app.get('/deletedata/:id',auth,(req,res)=>{
	addressBooks.deleteOne({_id:req.params.id},(err)=>{
         if(err)
         {
         	console.log(err)
         }
         else
         {
         	res.redirect('/home')
         }
	})
})

app.get('/logout',(req,res)=>{
	req.session.destroy()
	res.redirect('/login')
})
app.post('/register',(req,res)=>{
	console.log(req.body)
    let user=new Users({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password
    }) 
    user.save()
    res.redirect('/login')
})

app.post('/login',(req,res)=>{
	console.log(req.body)
	Users.findOne({email:req.body.email, password:req.body.password},function(err,user){
		if(user)
		{   req.session.isLogin='true';
	        req.session.user=req.body.email;
			res.redirect('/home')
		}
		else
		{
			console.log(err)
		}
	})
})

app.post('/addname',(req,res)=>{
	console.log(req.body)
    let book=new addressBooks({
      name: req.body.name,
      myemail: req.session.user,
      phoneno: req.body.phone,
      address: req.body.address
    }) 
    book.save()
    res.redirect('/home')
})

app.post('/editname/:id',(req,res)=>{
     addressBooks.updateOne({_id:req.params.id},{
     	name:req.body.name,
     	phoneno:req.body.phone,
     	address:req.body.address
     },function(err){
     	if(err)
     	{
     		console.log(err);
     	}
     	else
     	{
     		res.redirect('/home')
     	}
     })
})
app.listen(5000,()=>{
	console.log("Server is running on port 5000")
})