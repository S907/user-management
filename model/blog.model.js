const mongoose= require('mongoose');
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
    
    title:{
        type:String,
        required:true

    },
    blog:{
        type:String,
        required:true
    },
    date: {
        type: String,
        required: true
    },
    image:{
        type:String,
        required:true
    },
    writer: {
        type: String,
        required: true
    },
    isDeleted:{
        type: Boolean,
        default: false
    }
},{
    timestamps:true,
    versionKey:false
})

module.exports = new mongoose.model('blog', BlogSchema);