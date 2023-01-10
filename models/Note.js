import mongoose, { Schema } from "mongoose";

const NotesSchema = new Schema({
    user : {
        type : Schema.Types.ObjectId,
        ref : 'user'
    },
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

const Note = mongoose.model('notes', NotesSchema);

export default Note; 