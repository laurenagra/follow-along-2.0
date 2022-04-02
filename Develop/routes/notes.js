const notes = require('express').Router();
const { readFromFile, readAndAppend, writeToFile } = require('../helpers/utils');
const { v4: uuidv4} = require("uuid");

notes.get("/notes", (req, res) => {
    console.info(`${req.method} request received for notes`);
    // read file from this file path, then parse response?
    readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
  });
  
  // POST Route for adding notes.
  notes.post("/notes", (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add note`);
  
    // deconstructed assignment for the items in req.body
    const { title, text } = req.body;
  
    // If all the required properties are present
    if (title && text) {
      // Variable for the object we will save. Adds random number for feedback_id
      const newNote = {
        title,
        text,
        feedback_id: uuidv4(),
      };
      // appends new note object to json file containing user input and id
      readAndAppend(newNote, "./db/db.json");
  
      const response = {
        status: "success",
        body: newNote,
      };
  
      res.json(response);
    } else {
      res.json("Error in posting feedback");
    }
  });
  
  // :id is variable for any id
  notes.delete("/notes/:id", (req, res) => {
    readFromFile("./db/db.json").then((data) => {
      const notes = JSON.parse(data);
      console.log(notes)
      const note = notes.find((c) => c.feedback_id === req.params.id);
      //filters out id
      if (!note) return res.status(404).send("Note with given id not found");
      // delete
      const index = notes.indexOf(note);
      console.log(index)
      notes.splice(index, 1);
  
      writeToFile("./db/db.json", notes)
      // return the same note
      res.send(`note deleted`);
    });
  });
  module.exports = notes;