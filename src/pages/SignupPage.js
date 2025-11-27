// src/pages/SignupPage.js

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authApi from "../api/authApi";

function SignupPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail]       = useState("");
    const [password, setPassword] = useState("");
    const [error, setError]       = useState("");
    const [success, setSuccess]   = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!username || !email || !password) {
            setError("All fields are required");
            return;
        }

        // match your express-validator rule (min length 4)
        if (password.length < 4) {
            setError("Password must be at least 4 characters");
            return;
        }

        try {
            const res = await authApi.signup({ username, email, password });
            console.log("SIGNUP RESPONSE:", res.data || res);

            setSuccess("Signup successful! You can now log in.");
            // small delay so user sees message
            setTimeout(() => navigate("/login"), 800);
        } catch (err) {
            console.error("SIGNUP ERROR (frontend):", err.response?.data || err);

            // If server sent a response
            if (err.response) {
                const data = err.response.data;

                if (typeof data === "string") {
                    // Sometimes server sends plain text / HTML
                    setError(data);
                } else if (data?.message) {
                    // e.g. { message: "Email already registered" }
                    setError(data.message);
                } else if (Array.isArray(data?.errors) && data.errors.length > 0) {
                    // express-validator: show first validation error
                    setError(data.errors[0].msg || "Signup failed");
                } else {
                    // Unknown JSON shape – show it so you can debug
                    setError("Signup failed: " + JSON.stringify(data));
                }
            } else {
                // No response at all (network / CORS)
                setError("Network error: " + (err.message || "Unknown error"));
            }
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "2rem auto" }}>
            <h2>Sign Up</h2>

            {error && (
                <div style={{ color: "red", marginBottom: "0.5rem" }}>{error}</div>
            )}
            {success && (
                <div style={{ color: "green", marginBottom: "0.5rem" }}>{success}</div>
            )}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "0.5rem" }}>
                    <label>Username</label>
                    <input
                        style={{ width: "100%" }}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div style={{ marginBottom: "0.5rem" }}>
                    <label>Email</label>
                    <input
                        style={{ width: "100%" }}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div style={{ marginBottom: "0.5rem" }}>
                    <label>Password</label>
                    <input
                        style={{ width: "100%" }}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button type="submit">Sign Up</button>
            </form>

            <p style={{ marginTop: "1rem" }}>
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
}

export default SignupPage;

