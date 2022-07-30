const express= require ('express');
const fetchuser = require('../middleware/fetchuser');
const router= express.Router();
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');



    // ROUTE 1: Get all notes using: GET "/api/auth/getuser"
router.get('/fetchallnotes', fetchuser, async (req, res)=>{
    try {
        const notes = await Note.find({user: req.user.id})
        res.json(notes)
    } catch (error) {
        console.error(error.message);
         res.status(500).send("We caught error")
    }
   
} )

        // ROUTE 2: Add a new note using: GET "/api/auth/getuser"    
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description','description must be at least 5 chars').isLength({ min: 7 }),],async (req, res)=>{
        try {
        
        const {title, description, tag} = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const note= new Note({
            title, description, tag, user: req.user.id
        })

        const saveNote = await note.save();
        res.json(saveNote)
        } catch (error) {
            console.error(error.message);
            res.status(500).send("We caught error")
    }
    } )

    // ROUTE 3: Update an exsiting Note using: PUT "/api/auth/updatenote"
        router.put('/updatenote/:id', fetchuser, async (req, res)=>{
            const {title, description, tag} = req.body;
        try {
            const newnote={};
            if (title){newnote.title= title};   
            if (description){newnote.description= description};    
            if (tag){newnote.tag= tag};
            
            let note= await Note.findById(req.params.id);
            if(!note){
                return res.status(404).send("Not Found")
            }
            
            if(note.user?.toString()== req.user.id){
                return res.status(401).send("Prohibited to access")
     
            }
            note= await Note.findByIdAndUpdate(req.params.id, {$set: newnote}, {new:true})
            res.json({note})
        } 
        catch (error) {
            console.error(error.message);
            res.status(500).send("We caught error")
        }
            // Create a new object


        })

        // ROUTE 3: Delete an exsiting Note using: PUT "/api/notes/deletenote"
        router.delete('/deletenote/:id', fetchuser, async (req, res)=>{
        const {title, description, tag} = req.body;
        try {
            let note= await Note.findById(req.params.id);
        if(!note){
             return res.status(404).send("Not Found")
            }
            
        if(note.user?.user.toString() == req.user.id){
            return res.status(401).send("Prohibited to access")
     
            }
        note= await Note.findByIdAndDelete(req.params.id)
        res.json({"Success":"Note has been deleted",note:note})
        } catch (error) {
            console.error(error.message);
            res.status(500).send("We caught error")
        }
        
    
        })
module.exports = router