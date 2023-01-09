import mongoose from 'mongoose';
const mongooseURI = 'mongodb://127.0.0.1:27017/inotebook?connectTimeoutMS=50000';

export default function connectToDB ()  {
    mongoose.set('strictQuery', false);
    mongoose.connect(mongooseURI, () => {
        console.log('Connected to MongoDB');
    })
}