import express from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';

import User from '../models/User.js';
import fetchuser from '../middleware/fetchuser.js';

const JWT_SECRET = 'harekrishnaharekrishna';
const router = new express.Router();

// ROUTE 1: Create a user using: POST "/api/auth/createuser". No Login required
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Enter a valid password').isLength({ min: 5 })
], async (req, res) => {
    let success = false;
    // If there are errors, return Bad Request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() })
    }

    try {
        // Check whether the user with this email exists already
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({
                success,
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

        success = true;
        res.json({success, authtoken});
    } catch (e) {
        console.log(e.message)
        // Logger, SQS
        res.status(500).send('Internal server error');
    }
});

// ROUTE 2: Authenticate a user using: POST "/api/auth/login". No Login required
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password can\'t be blank').exists()
], async (req, res) => {
    let success = false;
    // If there are errors, return Bad Request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() })
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({ success, error: 'Please try to login with correct credentials'});
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ success, error: 'Please try to login with correct credentials' });
        }

        const data = {
            user : {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authtoken });

    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal server error');
    }
});

// ROUTE 3: Get loggedin User Details using: POST "api/auth/getuser". Login required
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password')

        res.send(user);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal server error');
    }
})


export default router;