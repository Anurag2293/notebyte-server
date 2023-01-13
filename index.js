import express from 'express';
import cors from 'cors';
import connectToDB from './db.js';
import authRouter from './routes/auth.js';
import notesRouter from './routes/notes.js';

connectToDB();

const app = express()
const port = 5000

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// Available routes 
app.use('/api/auth', authRouter);
app.use('/api/notes', notesRouter)

app.get('/', (req, res) => {
    res.send('Hello World! Hare Krishna')
})

app.listen(port, () => {
    console.log(`iNotebook server listening on port ${port}`)
})