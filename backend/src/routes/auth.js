const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../../config/db');
const secretKey = 'secret';

const router = express.Router();

router.post('/register', async (req, res) => {
    const { email, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const [result] = await db.execute(
            'INSERT INTO users (username, email, hashed_password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );
        res.status(201).send('User created successfully');
    } catch (error) {
        res.status(500).send('Error registering user');
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const [rows] = await db.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (rows.length > 0) {
            const user = rows[0];
            const isPasswordValid = await bcrypt.compare(password, user.hashed_password);

            if (isPasswordValid) {
                const token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });
                res.json({ token });
            } else {
                res.status(401).send('Invalid credentials');
            }
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (error) {
        res.status(500).send('Error logging in');
    }
});

module.exports = router;