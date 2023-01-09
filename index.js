import express from 'express';
import connectToDB from './db.js';
import authRouter from './routes/auth.js';
import notesRouter from './routes/notes.js';

connectToDB();

const app = express()
const port = 3000

app.use(express.json());

// Available routes 
app.use('/api/auth', authRouter);
app.use('/api/notes', notesRouter)

app.get('/', (req, res) => {
    res.send('Hello World! Hare Krishna')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})