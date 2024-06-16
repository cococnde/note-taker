const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
app.use(express.json());

// Set the port of our application
const PORT = 5500;

// Helper functions for reading and writing to the JSON file
const { readFromFile, readAndAppend } = require('./helpers/fsUtils');

//Function to retrieve notes from the db.json file
function retrieveNotes() {
    const data = fs.readFileSync(path.join(__dirname, 'db.json'), 'utf8');
    return JSON.parse(data);
}
//Function to write notes to the db.json file and return the new note
const { v4:uuidv4 } = require('uuid');
const saveNote = (note)=> {
    const notes = retrieveNotes();
    const newNote = { id: uuidv4(), ...note };
    notes.push(newNote);
    fs.writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify(notes));
    return newNote;
}

app.get('/api/notes', (req, res) => {
    const notes = retrieveNotes();
    res.json(notes);
});

app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    saveNote(newNote);
    res.json(newNote);
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});