import { useState } from "react";
import api from "../services/api";
import "../styles/Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="login-container">
      <h1>Stable Ops</h1>

      <h2>Login</h2>

      <form>
        <div>
          <label>Username</label>
          <br />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <br />

        <div>
          <label>Password</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <br />

        <button type="submit">
          Login
        </button>

        <button type="button" className="guest-button">
            Continue as Guest
        </button>
      </form>
    </div>
  );
}

export default Login;