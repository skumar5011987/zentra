import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from './Components/Navbar';
import Signin from './pages/signin';
import Signup from './pages/signup';
import Chatroom from './pages/chatroom';
import PendingRequestes from './pages/Pending';


function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
        <Route path="/" element={<Signin/>} />
          <Route path="/signin" element={<Signin/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/room" element={<Chatroom/>}/>
          <Route path="/notifications" element={<PendingRequestes/>}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;
