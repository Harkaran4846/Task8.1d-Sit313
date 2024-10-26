import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './Home'; 
import Post from './Post'; 
import NavigationBar from './Navbar';

function App() {
  return (
    <Router>
      <NavigationBar /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post" element={<Post />} /> 
      </Routes>
    </Router>
  );
}

export default App;
