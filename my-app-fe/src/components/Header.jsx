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
                props.setError(error.message)
            });
    }

    return (
        <>
            <div className="row mb-3">
                <div className="col-sm-5 text-start">
                    <div className="h3 py-2">Issue Tracker</div>
                </div>
                <div className="col-sm" />
                <div className="col-sm-3 py-2">
                    {props.authStatus &&
                        <button
                            className="btn btn-primary"
                            onClick={handleLogout}>
                            Logout
                        </button>}

                </div>
            </div>
            <div className="row">
                <div className="col-sm-12 py-2">
                    {props.error && <p className="text-danger">{props.error}</p>}
                </div>
            </div>
        </>


    )
}

export default Header;