import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import Notes from "../notes"


function App() {
  return (
    <div>
      <Header />
      {Notes.map(entry => (
        <Note
          key = {entry.key}
          title = {entry.title}
          content = {entry.content}
          />
      )
)}
      <Footer />
    </div>
  );
}

export default App;
