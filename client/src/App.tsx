// import { Route } from "react-router-dom/cjs/react-router-dom.min";
import { Route } from "react-router-dom";
import "./App.css";
import HomePage from "../pages/HomePage";
import ChatPage from "../pages/ChatPage";
import React from "react";

// import { Button } from '@chakra-ui/react'

function App() {
  // const [count, setCount] = useState(0)
  return (
    <div className="App">
      <Route path="/" component={HomePage} exact></Route>
      <Route path="/chats" component={ChatPage}></Route>
    </div>
  );
}

export default App;
