// Set the server's port number to either the environment variable PORT or 3000
const PORT = process.env.PORT || 3000;

// Import required modules
const path = require('path');
const express = require('express');
const { v4: uuidv4 } = require('uuid');

// Create an Express application
const app = express();

// Import modules
const { readDataFromFile, createNewNote, deleteNote } = require('./helpers/helpers');

// Define the path to the JSON file where notes will be stored
const DB_FILE_PATH = path.join(__dirname, './db/db.json');

// Middlewares:
// - Parse incoming JSON data
// - Parse incoming URL-encoded data
// - Serve static files from the 'public' directory
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Function to initialize the application by reading data from the JSON file and starting the server
async function initialize() {
    try {
        const data = await readDataFromFile(DB_FILE_PATH);
        app.locals.allNotes = data || [];

        app.listen(PORT, () => {
            console.log(`API server now on port ${PORT}!`);
        });
    } catch (err) {
        console.error('Error initializing data:', err);
        app.locals.allNotes = [];
    }
}

// Set up the routes

// GET request to '/api/notes' returns all not
app.get('/api/notes', (req, res) => {
    res.json(app.locals.allNotes);
});

// GET request to the root path returns the 'index.html' file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// GET request to '/notes' returns the 'notes.html' file
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});


// For any other undefined routes, return the 'index.html' file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// POST request to '/api/notes' creates a new note
app.post('/api/notes', async (req, res) => {
    try {
        const newNote = await createNewNote(req.body, app.locals.allNotes);
        res.json(newNote);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create note.' });
    }
});

// DELETE request to '/api/notes/:id' deletes a note with the specified ID
app.delete('/api/notes/:id', async (req, res) => {
    try {
        const noteIdToDelete = req.params.id;
        await deleteNote(noteIdToDelete, app.locals.allNotes);
        app.locals.allNotes = app.locals.allNotes.filter((note) => note.id !== noteIdToDelete);
        res.json(true);
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete note.' });
    }
});

// Call the initialize function to start the server
initialize();
