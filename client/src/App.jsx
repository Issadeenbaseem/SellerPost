//import { useState } from 'react'

import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import {SignIn} from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import About from "./pages/About";
import Header from "./components/Header";

function App() {
  return (
    <>
      <BrowserRouter>
      <Header/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn/>} />
          <Route path="/sign-up" element={<SignUp/>} />
          <Route path="/about" element={<About/>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
