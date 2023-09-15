const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name:{
        type:String,
        required:true
    }, 
    email:{
        type:String,
        required:true
    },
    password:{
        type:String, 
        required:true,
        select:false,
    },
    dateOfBirth: {
		type: String,
		required: true,
	},
	verified: {
		type: Boolean,
		required: false,
		default: false
	} 
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
