const path = require('path');
const { createNewNote, deleteNote } = require('./helpers');

function setupRoutes(app) {
    // GET request to '/api/notes' returns all not and
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
}

module.exports = { setupRoutes };