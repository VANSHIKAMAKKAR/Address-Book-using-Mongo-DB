const mongoose=require('mongoose')

const bookSchema = mongoose.Schema({
	myemail:{
 		type:String,
 		required:true
	},
	name:{
 		type:String,
 		required:true
	},
	address:{
		type:String,
		required:true,
		unique:true
	},
	phoneno:{
        type:String,
        required:true,
        unique:true
	}
})

const book=module.exports=mongoose.model('book',bookSchema)