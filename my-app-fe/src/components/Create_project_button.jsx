import { useNavigate } from "react-router-dom";

function Create_project() {

    const navigate = useNavigate();
    
    const nav_project_creation = () => {
        navigate("/create", {state: { project_id: null }});
    };

    return (
        <div className="container">
            <div className="row justify-content-center mt-5">
                <div className="col-auto">
                    <button className="btn btn-primary" onClick={nav_project_creation}>Create Project</button>
                </div>
            </div>
            <div className="row mt-5">
                <div className="col">
                    <hr />
                </div>
            </div>
        </div>
    );
}

export default Create_project;



