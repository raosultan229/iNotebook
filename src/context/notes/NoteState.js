import React, { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props)=>{
  const host= "http://localhost:5000"
   const notesinitial=[]
    const [notes, setNotes] = useState(notesinitial);
    const getNotes= async()=>{
        // API Call
     const response = await fetch(`${host}/api/notes/fetchallnotes`, {
       method: 'GET', 
       headers: {
         'Content-Type': 'application/json', 
         "auth-token" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjI1ODYxMmJkNDYzNjFiZjMzZDVlNGIwIn0sImlhdCI6MTY0OTk2NTA4Nn0.8yBkaoKCe4KDdmHY79HhDX5ah0QbShvD5x_zEXkulWs"
       },
     });
     const json =await response.json()
     console.log(json)
     setNotes(json)
   }

    
       // Add a Note
    const addNote= async(title, description, tag)=>{
       // todo: API Call
         // API Call
      const response = await fetch(`${host}/api/notes/addnote`, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json', 
          "auth-token" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjI1ODYxMmJkNDYzNjFiZjMzZDVlNGIwIn0sImlhdCI6MTY0OTk2NTA4Nn0.8yBkaoKCe4KDdmHY79HhDX5ah0QbShvD5x_zEXkulWs"
        },
        body: JSON.stringify({title, description, tag}) 
      });
       console.log("adding note")
    const note=  {
      "title": title,
      "description": description,
      "tag": tag,
      "_id": "6266cfd57662ecc68b1c4dea",
      "date": "1650905045927",
      "__v": 0
    }
    setNotes(notes.concat(note));
    }

        // Delete Note 
    const deleteNote=async(id)=>{
      const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
        method: 'DELETE', 
        headers: {
          'Content-Type': 'application/json', 
          "auth-token" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjI1ODYxMmJkNDYzNjFiZjMzZDVlNGIwIn0sImlhdCI6MTY0OTk2NTA4Nn0.8yBkaoKCe4KDdmHY79HhDX5ah0QbShvD5x_zEXkulWs"
        },
      });
      const json = response.json();
      console.log(json);

      console.log("deleting notes with "+id)
      const newNotes = notes.filter((note)=>{return note._id!==id})
      setNotes(newNotes)

    }
      // Edit Note 
    const editNote= async(id, title, description, tag)=>{

        // API Call
      const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json', 
          "auth-token" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjI1ODYxMmJkNDYzNjFiZjMzZDVlNGIwIn0sImlhdCI6MTY0OTk2NTA4Nn0.8yBkaoKCe4KDdmHY79HhDX5ah0QbShvD5x_zEXkulWs"
        },
        body: JSON.stringify({title, description, tag})
      });
      const json = response.json();
    
      for (let index = 0; index < notes.length; index++) {
        const element = notes[index];
        if (element._id===id){
          element.title = title;
          element.description = description;
          element.tag = tag;

        }
        
      }
    }


      return (<NoteContext.Provider value={{notes, addNote, deleteNote, editNote, getNotes}}> 
        {props.children}
      </NoteContext.Provider> 
        )}
    export default NoteState;