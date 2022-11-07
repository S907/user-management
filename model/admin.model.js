const mongoose = require('mongoose');
const Schema= mongoose.Schema;

const AdminSchema = new Schema({
firstName:{
    type:String,
    require:true
},
lastName:{
    type:String, 
    require:true
},
fullName:{
    type:String,
    required:true
},
role:{
    type:String,
    required:true,
    default:'User',
    enum:['Admin','User']
},
image:{
    type:String,
    required:true
},
email:{
    type:String,
    required:true
},
password:{
    type:String,
    required:true
}
},{
    timestamps:true,
    versionKey:false
})

module.exports = new mongoose.model('admin', AdminSchema)