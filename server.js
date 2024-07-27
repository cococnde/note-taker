const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4:uuidv4 } = require('uuid');
const PORT = process.env.PORT || 3000;

// Create an instance of the express app.
const app = express();
// Set the port of our application
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

//Function to retrieve notes from the db.json file
const retrieveNotes = () => {
    const data = fs.readFileSync(path.join(__dirname, 'db.json'), 'utf8');
    return JSON.parse(data);
};

  //Function to save notes to the db.json file
  const saveNote = (note)=> {
    const notes = retrieveNotes();
    const newNote = { id: uuidv4(), ...note };
    notes.push(newNote);
    fs.writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify(notes));
    return newNote;
    };
    
    
    app.get('/api/notes/:id?', (req, res) => {
        const notes = retrieveNotes();
        if (req.params.id) {
          const note = notes.find(n => n.id === req.params.id);
          if (!note) return res.status(404).send('Note not found');
          res.json(note);
        } else {
          res.json(notes);
        }
      });

  app.post('/api/notes', (req, res) => {
    const newNote = saveNote(req.body);
    res.status(201).json(newNote);
  });

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});
app.use(express.static('public'));
fetch('http://localhost:3000/api/notes')
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});