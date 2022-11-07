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

message:{
    type:String,
    required:true
},
isDeleted:{
    type:Boolean,
    default:false
}
},{
    timestamps:true,
    versionKey:false
})

module.exports = new mongoose.model('contact-page', AdminSchema)