import React, { useState } from "react";
import "./Login.css";
import Header from "../Header/Header";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const login = async (e) => {
    e.preventDefault();

    try {
      const login_url = "http://localhost:8000/djangoapp/login";

      const res = await fetch(login_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: userName,
          password: password,
        }),
      });

      const json = await res.json();

      console.log("Login response:", json);

      if (
        json.status === "Authenticated" ||
        json.status === "success"
      ) {
        sessionStorage.setItem(
          "username",
          json.userName || userName
        );

        alert("Login successful!");

        window.location.href = "/";
      } else {
        alert(
          json.message || "The user could not be authenticated."
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Unable to connect to the server.");
    }
  };

  return (
    <div>
      <Header />

      <div className="login_panel">
        <h1>Dealer Login</h1>

        <form onSubmit={login}>
          <div>
            <label>Username</label>
            <input
              type="text"
              placeholder="Username"
              className="input_field"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
              className="input_field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <button className="action_button" type="submit">
              Login
            </button>

            <button
              className="action_button"
              type="button"
              onClick={() => {
                window.location.href = "/";
              }}
            >
              Cancel
            </button>
          </div>

          <a className="loginlink" href="/register">
            Don't have an account? Register Now
          </a>
        </form>
      </div>
    </div>
  );
};

export default Login;