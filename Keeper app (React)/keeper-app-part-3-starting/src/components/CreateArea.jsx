import React from "react";

function CreateArea(props) {
  const [note,setNote] = React.useState({
    title:"",
    content:""
  })
  
  function handleChange(event){
    const {name,value} = event.target                       //here name and values are the passed on keywords from the input and textarea

    setNote(prevNote => {                                   //prevNote denotes the previouslt contained content inside the Note's state
      return {
        ...prevNote,                                        //using spread operator to use the previously saved state to append and return a new object
        [name]:value                                        //save the current value in the name key which can be obtained by putting square backets. So [name] extracts the actual value stored in the name key, and assigns it the value we destructured above
      }
    })
  }

  function submitNote(event){
    props.onAdd(note)                                       //passing the current state por recently created note to the onAdd function
    event.preventDefault();                                 //prevents the refresh/reload screen behaviour upon form submission
    setNote({                                               //after adding the note, we refresh the state and clear our input box so that we can easily add new note with no old content being displayed on it
      title:"",
      content:""
    }) 
  }

  return (
    <div>
      <form>
        
        <input
        onChange={handleChange} 
        name="title" 
        value={note.title} 
        placeholder="Title"  
        />
        
        <textarea 
        onChange={handleChange}
        name="content" 
        value={note.content} 
        placeholder="Take a note..." 
        rows="3"  
        />

        <button onClick={submitNote}>Add</button>
      </form>
    </div>
  );
}

export default CreateArea;
