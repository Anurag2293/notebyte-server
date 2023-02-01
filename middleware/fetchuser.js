import jwt from 'jsonwebtoken';

const JWT_SECRET = 'harekrishnaharekrishna';

const fetchuser = (req, res, next) => {
    // Get the user from jwt token and add it to req body
    const token = req.header('auth-token');

    if (!token) {
        return res.status(401).send({ success: false, error: "Please authenticate using a valid token" });
    }

    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ success: false, error: 'Please authenticate using a valid token'});
    }
}

export default fetchuser;