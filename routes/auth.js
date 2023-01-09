import express from 'express';
import User from '../models/User.js';

const router = new express.Router();

// Create a user using: POST "/api/auth/" Doesn't require auth.
router.get('/', async (req, res) => {
    try {
        console.log(req.body)
        const user = new User(req.body);

        await user.save();
        res.status(201).send(req.body);
    } catch (e) {
        res.status(500).send(e);
    }
});

export default router;