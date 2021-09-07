import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";

function App() {
  //to keep track of notes we need to make an array of notes whose state will be always checked

  const [notes,setNote] = React.useState([])                              //initially an empty array
  
  function addNote(newNote){
    setNote(prevNotes=>[...prevNotes,newNote])                            //getting hold of original state and appending the newly added note to it using spread operator
  }

  function deleteNote(id){
    setNote(prevNotes=>{                                                  //from prevNotes, we need to return a new array consisting of all elements except the one with given ID
      return prevNotes.filter((noteItem,index)=>{                         //filtering through the note
        return index!==id                                                 //filter the array and find the element to be deleted by its ID, by the procedure of returning only those elements which have index value not equal to the ID of 'to be deleted note'
      })
    })
  }

  return (
    <div>
      <Header/>
      <CreateArea 
        onAdd = {addNote}                                                 //passing a function as prop
      />
      {notes.map((noteItem,index)=>{
        return <Note
          key={index}
          id={index}
          title={noteItem.title}
          content={noteItem.content}
          onDelete={deleteNote}                                           //deleting function being passed to delete the desired note
        />
      })}
      <Footer />
    </div>
  );
}

export default App;
