import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authApi from '../api/authApi';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Email and password are required');
            return;
        }

        try {
            const res = await authApi.login({ email, password });
            // adjust if your token field has a different name (e.g. res.data.jwt)
            localStorage.setItem('token', res.data.token);
            navigate('/employees');
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: '2rem auto' }}>
            <h2>Login</h2>
            {error && <div style={{ color: 'red', marginBottom: '0.5rem' }}>{error}</div>}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '0.5rem' }}>
                    <label>Email</label>
                    <input
                        style={{ width: '100%' }}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} // controlled component
                    />
                </div>

                <div style={{ marginBottom: '0.5rem' }}>
                    <label>Password</label>
                    <input
                        style={{ width: '100%' }}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} // controlled
                    />
                </div>

                <button type="submit">Login</button>
            </form>

            <p style={{ marginTop: '1rem' }}>
                Don&apos;t have an account? <Link to="/signup">Sign up</Link>
            </p>
        </div>
    );
}

export default LoginPage;
