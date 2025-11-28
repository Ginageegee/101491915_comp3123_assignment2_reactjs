import { useNavigate, Link } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 22px',
            backgroundColor: '#1e1e2f',
            borderBottom: '3px solid #646cff',
            color: 'white',
            fontSize: '16px'
        }}>

            <h3 style={{margin: 0, color: '#ffffff'}}>Employee Portal</h3>

            <div>
                {token ? (
                    <button
                        onClick={handleLogout}
                        style={{
                            backgroundColor: '#ff4d4d',
                            border: 'none',
                            padding: '8px 14px',
                            borderRadius: '6px',
                            color: 'white',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            transition: '0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.opacity = "0.8"}
                        onMouseOut={(e) => e.target.style.opacity = "1"}
                    >
                        Logout
                    </button>
                ) : (
                    <>
                        <Link
                            to="/login"
                            style={{
                                marginRight: '14px',
                                textDecoration: 'none',
                                color: 'white',
                                fontWeight: 'bold',
                                transition: '0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.color = "#9ea8ff"}
                            onMouseOut={(e) => e.target.style.color = "white"}
                        >
                            Login
                        </Link>

                        <Link
                            to="/signup"
                            style={{
                                textDecoration: 'none',
                                backgroundColor: '#646cff',
                                padding: '8px 14px',
                                borderRadius: '6px',
                                color: 'white',
                                fontWeight: 'bold',
                                transition: '0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.opacity = "0.8"}
                            onMouseOut={(e) => e.target.style.opacity = "1"}
                        >
                            Sign Up
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
