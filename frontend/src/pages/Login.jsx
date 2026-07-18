import "../styles/Login.css";

function Login() {
  return (
    <div className="login-container">
      <h1>Stable Ops</h1>

      <h2>Login</h2>

      <form>
        <div>
          <label>Username</label>
          <br />
          <input type="text" />
        </div>

        <br />

        <div>
          <label>Password</label>
          <br />
          <input type="password" />
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