import { useState } from "react";
import api from "../services/api";
import "../styles/Login.css";

import { useNavigate } from "react-router-dom";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const formData = new URLSearchParams();
            formData.append("username", username);
            formData.append("password", password);

            const response = await api.post("/login", formData);

            localStorage.setItem(
                "access_token",
                response.data.access_token
            );

            localStorage.setItem("username", username);

            navigate("/dashboard");
        } catch (error) {
            console.error(error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGuestLogin = async () => {
        try {
            setLoading(true);

            const formData = new URLSearchParams();
            formData.append("username", "guest");
            formData.append("password", "guest123");

            const response = await api.post("/login", formData);

            localStorage.setItem(
                "access_token",
                response.data.access_token
            );

            localStorage.setItem("username", "Guest");

            navigate("/dashboard");
        } catch (error) {
            console.error(error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h1>Stable Ops</h1>

            <h2>Login</h2>

            <form onSubmit={handleLogin}>
                <div>
                    <label>Username</label>
                    <br />
                    <input
                        type="text"
                        value={username}
                        onChange={(e) =>
                            setUsername(e.target.value)
                        }
                    />
                </div>

                <br />

                <div>
                    <label>Password</label>
                    <br />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                    />
                </div>

                <br />

                <button type="submit"
                    disabled={loading}
                >
                    {loading ? "Signing in..." : "Login"}
                </button>

                <button
                    type="button"
                    className="guest-button"
                    onClick={handleGuestLogin}
                    disabled={loading}
                >
                    {loading ? "Starting demo..." : "Continue as Guest"}
                </button>
            </form>
        </div>
    );
}

export default Login;