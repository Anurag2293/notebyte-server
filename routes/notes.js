import express from 'express';
import { body, validationResult } from 'express-validator';

import Note from '../models/Note.js';
import fetchuser from '../middleware/fetchuser.js';
const router = new express.Router();

// ROUTE 1: Get All the notes using: GET "api/notes/getuser". Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        res.status(500).send('Internal server error');
    }
})

// ROUTE 2: Add a new note using: POST "api/notes/addnote". Login required
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5 })
], async (req, res) => {
    try {
        const errors = validationResult(req);
        // If there are errors, return Bad Request and the errors
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const { title, description, tag } = req.body;

        const note = new Note({
            user: req.user.id,
            title, description, tag
        })

        const savedNote = await note.save();
        res.json(savedNote);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal server error');
    }
});


export default router;