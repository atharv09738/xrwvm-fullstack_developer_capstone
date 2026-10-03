import React from "react";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Dealers from "./components/Dealers/Dealers";
import Dealer from "./components/Dealers/Dealer";
import PostReview from "./components/Dealers/PostReview";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dealers" element={<Dealers />} />
      <Route path="/dealer/:id" element={<Dealer />} />
      <Route path="/postreview/:id" element={<PostReview />} />
      <Route path="/about" element={<><Header /><div style={{padding:"60px",textAlign:"center"}}><h1>About Us</h1><p>AutoDealer - Your trusted car dealership platform.</p></div></>} />
      <Route path="/contact" element={<><Header /><div style={{padding:"60px",textAlign:"center"}}><h1>Contact Us</h1><p>Email: support@autodealer.com</p></div></>} />
      <Route path="/" element={
        <div>
          <Header />
          <div style={{ padding: "60px", textAlign: "center" }}>
            <h1>Welcome to AutoDealer</h1>
            <p>Dealer Management Platform</p>
            {sessionStorage.getItem("username") ? (
              <button onClick={() => { window.location.href = "/dealers"; }} style={{padding:"12px 30px",fontSize:"16px",cursor:"pointer",borderRadius:"8px"}}>
                View Dealerships
              </button>
            ) : (
              <div>
                <button onClick={() => { window.location.href = "/login"; }} style={{padding:"12px 30px",fontSize:"16px",cursor:"pointer",borderRadius:"8px"}}>
                  Login
                </button>
                <button onClick={() => { window.location.href = "/register"; }} style={{padding:"12px 30px",fontSize:"16px",cursor:"pointer",borderRadius:"8px",marginLeft:"10px"}}>
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      } />
    </Routes>
  );
}

export default App;