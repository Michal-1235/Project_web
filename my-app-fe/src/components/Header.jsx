import { logout } from '../services/authService';
import { useNavigate } from 'react-router-dom';

function Header(props) {

    const navigate = useNavigate();

    function handleLogout() {
            logout()
            .then(() => {
                props.setAuthStatus(false);
                navigate('/');
            })
            .catch((error) => {
                console.log(error.message);
            });
    }

    return (
        <>
            <div className="row mb-3">
                <div className="col-sm-5 text-start">
                    <div className="h3 py-2">Issue Tracker</div>
                </div>
                <div className="col-sm" />
                <div className="col-sm-4 text-end py-2">
                    {props.authStatus ? (
                        <button
                            className="btn btn-primary"
                            onClick={handleLogout}>
                            Logout
                        </button>
                    ) : (
                        <span>Not logged in</span>
                    )}
                </div>
            </div>
            <div className="row">
                <div className="col-sm-12 text-center py-2">
                    {props.authStatus && props.adminStatus && (
                        <span>Logged in - admin account</span>
                    )}
                    {props.authStatus && !props.adminStatus && (
                        <span>Logged in - user account</span>
                    )}
                </div>
            </div>
        </>
    )
}

export default Header;