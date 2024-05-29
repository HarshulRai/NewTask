const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();


const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'taskassignment',
    password: '12345',
    port: 5432,
});

app.use(bodyParser.json());

app.post('/', async (req, res) => {
    const { email, name } = req.body;
    
    if (!email || !name) {
        return res.status(400).json({ error: 'Email and name are required' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
            [name, email]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000}`);
});
