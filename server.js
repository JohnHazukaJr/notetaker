const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const app = express();
const port = 3000;

app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// GET endpoint to fetch all notes
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading file');
        }
        res.json(JSON.parse(data));
    });
});

// POST endpoint to add a new note
app.post('/api/notes', (req, res) => {
    const newNote = { id: uuidv4(), ...req.body };

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading file');
        }
        const notes = JSON.parse(data);
        notes.push(newNote);

        fs.writeFile('./db/db.json', JSON.stringify(notes, null, 2), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error writing file');
            }
            res.json(newNote);
        });
    });
});


// Route to serve notes.html when '/notes' is accessed
app.get('/notes', (req, res) => {
    // The path is relative to the server.js file
    res.sendFile('./public/notes.html', { root: __dirname });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
