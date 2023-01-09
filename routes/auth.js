import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
const router = new express.Router();

// Create a user using: POST "/api/auth/createuser". No Login required
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Enter a valid password').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    // typeof(errors) --> Object
    // typeof(errors.array()) --> Object

    // If there are errors, return Bad Request and the errors
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        // Check whether the user with this email exists already
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({
                error: 'Sorry, a user with same email exits'
            })
        }

        // Create a new user
        user = await User.create({
            name: req.body.name,
            password: req.body.password,
            email: req.body.email
        })

        res.json(user);
    } catch (e) {
        console.log(e.message)
        // Logger, SQS
        res.status(500).send('Some error occured');
    }
});

export default router;