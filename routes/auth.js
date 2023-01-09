import express from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';

import User from '../models/User.js';

const JWT_SECRET = 'harekrishnaharekrishna';
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

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email
        })

        const data = {
            user : {
                id : user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);

        res.json({authtoken});
    } catch (e) {
        console.log(e.message)
        // Logger, SQS
        res.status(500).send('Some error occured');
    }
});

export default router;