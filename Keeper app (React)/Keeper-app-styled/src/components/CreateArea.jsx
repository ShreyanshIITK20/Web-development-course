import React, { useState } from "react";
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Zoom from '@material-ui/core/Zoom';

function CreateArea(props) {
  
  const [note, setNote] = useState({
    title: "",
    content: ""
  });

  // keep track of the input box being clicked or not for expansion
  const [isExpanded,setExpanded] = useState(false)                

  function handleChange(event) {
    const { name, value } = event.target;

    setNote(prevNote => {
      return {
        ...prevNote,
        [name]: value
      };
    });
  }

  function expand(){
    setExpanded(true)
  }

  function submitNote(event) {
    props.onAdd(note);
    setNote({
      title: "",
      content: ""
    });
    event.preventDefault();
  }

  return (
    <div>
      <form className="create-note">                            
        {isExpanded===true ? <input
          name="title"
          onChange={handleChange}
          value={note.title}
          placeholder="Title"
        /> : null}
        <textarea
          onClick={expand}
          name="content"
          onChange={handleChange}
          value={note.content}
          placeholder="Take a note..."
          rows={isExpanded===true?3:1}                          //initially only 1 row, and when clicked then expanded to a 3 row textbox
        />
        
        {/* zoom in effect on button */}
        <Zoom in={isExpanded}>                                            
          <Fab onClick={submitNote}><AddIcon/></Fab>
        </Zoom>
      </form>
    </div>
  );
}

export default CreateArea;
