const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(express.json());
app.use(cors());

    const pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'Summer Waitlist',
        password: 'postgres',
        port: '5555',
    });

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`Server running on PORT ${PORT}`);
    });




    app.post('/api/waitlist', async (req, res) => {
        try {
            const { description } = req.body;
            const result = await pool.query('INSERT INTO waitlist (description) VALUES ($1) RETURNING *', [description]);
            res.json(result.rows[0]);
        } catch (err) {
            res.status(500).send('Server Error');
        }
    });




    app.get('/api/waitlist', async (req, res) => {
        try {
            const result = await pool.query('SELECT * FROM waitlist');
            res.json(result.rows);
        } catch (err) {
            res.status(500).send('Server Error');
        }
    });

    app.get('/api/waitlist/:id', async (req, res) => {
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




    app.put('/api/waitlist/:id', async (req, res) => {
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




    app.delete('/api/waitlist/:id', async (req, res) => {
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
