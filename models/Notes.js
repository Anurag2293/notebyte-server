import mongoose, { Schema } from "mongoose";

const NotesSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true,
    },
    tag : {
        type : String,
        deafult : 'General'
    },
    date : {
        type : Date,
        default : Date.now
    }
})

export default const Notes = mongoose.model('notes', NotesSchema);