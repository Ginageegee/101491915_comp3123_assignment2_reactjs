import { useNavigate, Link } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
            {token ? (
                <>
                    <button onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <>
                    <Link to="/login" style={{ marginRight: '10px' }}>
                        Login
                    </Link>
                    <Link to="/signup">Sign Up</Link>
                </>
            )}
        </nav>
    );
}

export default Navbar;
