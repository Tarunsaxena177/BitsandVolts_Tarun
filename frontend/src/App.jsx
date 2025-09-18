import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import AddUser from "./components/AddUser";
import EditUser from "./components/EditUser";
import ViewUser from "./components/ViewUser";

function App() {
  return (
    <div>
      <header className="app-header">
        <div className="container text-center">
          <h5 className="mb-0">
            MERN stack developer practical task by Tarun Saxena
          </h5>
        </div>
      </header>

      <div className="main-container container my-4">
        <nav className="d-flex justify-content-between align-items-center mb-3"></nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddUser />} />
          <Route path="/edit/:id" element={<EditUser />} />
          <Route path="/view/:id" element={<ViewUser />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
