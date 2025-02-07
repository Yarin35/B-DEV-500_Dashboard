const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../../config/db');
const bcrypt = require('bcrypt');
const secretKey = 'secret';
const passport = require('passport');

const router = express.Router();

router.post('/register', async (req, res) => {
    const { email, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const [existingUser] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

        if (existingUser.length > 0) {
            // If user already exists, update the password and username
            await db.execute('UPDATE users SET username = ?, hashed_password = ? WHERE id = ?', [username, hashedPassword, existingUser[0].id]);
            const token = jwt.sign({ id: existingUser[0].id, username: existingUser[0].username }, secretKey, { expiresIn: '1h' });
            res.json({ token, userId: existingUser[0].id });
        } else {
            // Create a new user
            const [result] = await db.execute(
                'INSERT INTO users (username, email, hashed_password) VALUES (?, ?, ?)',
                [username, email, hashedPassword]
            );
            const userId = result.insertId;

            const [freeServices] = await db.execute('SELECT id FROM services WHERE requires_auth = false');
            const userServices = freeServices.map(service => [userId, service.id]);
            if (userServices.length > 0) {
                await db.query('INSERT INTO user_services (user_id, service_id) VALUES ?', [userServices]);
            }

            const token = jwt.sign({ id: userId, username }, secretKey, { expiresIn: '1h' });
            res.status(201).json({ token, userId: userId });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error registering user');
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

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
            } else if (user.google_id) {
                await db.execute('UPDATE users SET hashed_password = ? WHERE id = ?', [await bcrypt.hash(password, 10), user.id]);
                const token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });
                res.json({ token });
            } else {
                res.status(401).send('Invalid credentials');
            }
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (error) {
        console.log('Error logging in: ', error);
        res.status(500).send('Error logging in');
    }
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), async (req, res) => {
    try {
        const [existingUser] = await db.execute('SELECT * FROM users WHERE email = ?', [req.user.email]);

        if (existingUser.length > 0) {
            await db.execute('UPDATE users SET google_id = ? WHERE id = ?', [req.user.google_id, existingUser[0].id]);
            const token = jwt.sign({ id: existingUser[0].id, username: existingUser[0].username }, secretKey, { expiresIn: '24h' });
            res.redirect(`http://localhost:3000?token=${token}&userId=${existingUser[0].id}`);
        } else {
            const [ result ] = await db.execute('INSERT INTO users (username, email, google_id) VALUES (?, ?, ?)', [req.user.username, req.user.email, req.user.google_id]);

            const userId = result.insertId;

            const [freeServices] = await db.execute('SELECT id FROM services WHERE requires_auth = false');
            const userServices = freeServices.map(service => [userId, service.id]);
            if (userServices.length > 0) {
                await db.query('INSERT INTO user_services (user_id, service_id) VALUES ?', [userServices]);
            }

            const token = jwt.sign({ id: req.user.id, username: req.user.username }, secretKey, { expiresIn: '24h' });
            res.redirect(`http://localhost:3000?token=${token}$userId=${req.user.id}`);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error logging in');
    }
});

module.exports = router;