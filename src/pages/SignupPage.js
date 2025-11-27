import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authApi from '../api/authApi';

function SignupPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail]     = useState('');
    const [password, setPassword] = useState('');
    const [error, setError]     = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!username || !email || !password) {
            setError('All fields are required');
            return;
        }

        try {
            await authApi.signup({ username, email, password });
            navigate('/login');
        } catch (err) {
            setError('Signup failed');
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: '2rem auto' }}>
            <h2>Sign Up</h2>
            {error && <div style={{ color: 'red', marginBottom: '0.5rem' }}>{error}</div>}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '0.5rem' }}>
                    <label>Username</label>
                    <input
                        style={{ width: '100%' }}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div style={{ marginBottom: '0.5rem' }}>
                    <label>Email</label>
                    <input
                        style={{ width: '100%' }}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div style={{ marginBottom: '0.5rem' }}>
                    <label>Password</label>
                    <input
                        style={{ width: '100%' }}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button type="submit">Sign Up</button>
            </form>

            <p style={{ marginTop: '1rem' }}>
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
}

export default SignupPage;
