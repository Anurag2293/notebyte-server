import mongoose from 'mongoose';
const mongooseURI = 'mongodb://localhost:27017/';

export default function connectToDB ()  {
    mongoose.set('strictQuery', false);
    mongoose.connect(mongooseURI, () => {
        console.log('Connected to MongoDB');
    })
}