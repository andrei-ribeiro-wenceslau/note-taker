// Import required modules
const fs = require('fs').promises;

// Function to read data from the JSON file and parse it as an array of notes
async function readDataFromFile(filePath) {
    try {
        const fileData = await fs.readFile(filePath, 'utf8');
        return JSON.parse(fileData);
    } catch (err) {
        console.error('Error reading data from file:', err);
        return [];
    }
}

// Function to create a new note and add it to the array of notes
async function createNewNote(body, notesArray) {
    const newNote = { ...body, id: uuidv4() };
    notesArray.push(newNote);
    await fs.writeFile(DB_FILE_PATH, JSON.stringify(notesArray, null, 2));
    return newNote;
}

// Function to delete a note from the array of notes and update the JSON file
async function deleteNote(id, notesArray) {
    const updatedNotes = notesArray.filter((note) => note.id !== id);
    await fs.writeFile(DB_FILE_PATH, JSON.stringify(updatedNotes, null, 2));
}

module.exports = { readDataFromFile, createNewNote, deleteNote };
