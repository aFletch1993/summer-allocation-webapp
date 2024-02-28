const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config();
const jwtPass = process.env.JWT_SECRET;
const dbUser = process.env.DB_USER;
const dbHost = process.env.DB_HOST;
const dbPassword = process.env.DB_PASSWORD;
const dbPort = process.env.DB_PORT;
const dbDatabaseUrl = process.env.DATABASE_URL;

const app = express();
app.use(express.json());
app.use(cors());

    const pool = new Pool({
        user: dbUser,
        host: dbHost,
        database: dbDatabaseUrl,
        password: dbPassword,
        port: dbPort,
    });

    const verifyToken = (req, res, next) => {
        const token = req.headers['authorization'];
        if (!token) return res.status(401).send('Access Denied');

        try {
            token = token.replace(/^Bearer\s+/, "");
            const verified = jwt.verify(token, jwtPass);
            req.user = verified;
            next();
        } catch (error) {
            res.status(400).send('Invalid Token');
        }
    };


    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`Server running on PORT ${PORT}`);
    });

app.post('/register', verifyToken, async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newUser = await pool.query(
            'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING *', [username, hashedPassword]
        );
        res.status(201).json(newUser.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error during registration.');
    }
});

app.post('/login', verifyToken, async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (user.rows.length > 0 && await bcrypt.compare(password, user.rows[0].password_hash)) {
            const token = jwt.sign({ userId: user.rows[0].id }, `addsecretkeyhere`, {expiresIn: '1h' });
            res.json({ token });
        } else {
            res.status(401).send('Invalid Credentials.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error during login.');
    }
});


    app.post('/api/waitlist', verifyToken, async (req, res) => {
        try {
            const { description } = req.body;
            const result = await pool.query('INSERT INTO waitlist (description) VALUES ($1) RETURNING *', [description]);
            res.json(result.rows[0]);
        } catch (err) {
            res.status(500).send('Server Error');
        }
    });




    app.get('/api/waitlist', verifyToken, async (req, res) => {
        try {
            const result = await pool.query('SELECT * FROM waitlist');
            res.json(result.rows);
        } catch (err) {
            res.status(500).send('Server Error');
        }
    });

    app.get('/api/waitlist/:id', verifyToken, async (req, res) => {
        try {
            const { id } = req.params; // Extract ID from parameters
            const result = await pool.query('SELECT * FROM waitlist WHERE id = $1', [id]);
            if (result.rows.length === 0) {
                return res.status(404).send('Waitlist person not found');
            }
            res.json(result.rows[0]);
        } catch (err) {
            res.status(500).send('Server Error');
        }
    });




    app.put('/api/waitlist/:id', verifyToken, async (req, res) => {
        try {
            const { id } = req.params;
            const { description } = req.body;
            const result = await pool.query('UPDATE waitlist SET description = $1 WHERE id = $2 RETURNING *', [description, id]);
            if (result.rows.length === 0) {
                return res.status(404).send('Waitlist Person not found');
            }
            res.json(result.rows[0]);
        } catch (err) {
            res.status(500).send('Server Error');
        }
    });




    app.delete('/api/waitlist/:id', verifyToken, async (req, res) => {
        try {
            const { id } = req.params;
            const result = await pool.query('DELETE FROM waitlist WHERE id = $1 RETURNING *', [id]);
            if (result.rows.length === 0) {
                return res.status(404).send('Waitlist person not found');
            }
            res.send('Waitlist person deleted successfully');
        } catch (err) {
            res.status(500).send('Server Error');
        }
    });
