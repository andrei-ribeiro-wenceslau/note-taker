// Set the server's port number to either the environment variable PORT or 3000


// Import required modules
const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;

// Create an Express application
const app = express();

// Define the path to the JSON file where notes will be stored


// Import modules
const { PORT, DB_FILE_PATH } = require('./config');
const { readDataFromFile, createNewNote, deleteNote } = require('./helpers');
const { setupRoutes } = require('./routes');


// Middlewares:
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

setupRoutes(app);

// Call the initialize function to start the server
initialize();
