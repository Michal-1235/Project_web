function TeamLeaderProjects() {
    let teamData = JSON.parse(localStorage.getItem('teamData'));
    if (!Array.isArray(teamData)) {
        teamData = []; // Ensure teamData is an array
    }
    console.log("Team Data:", teamData);

    return (
        <div className="container">
            <h1>Team Leader Projects</h1>
            <ul>
                {teamData.map((project, index) => (
                    <li key={index}>
                        <strong>Title:</strong> {project.title} <br />
                        <strong>Description:</strong> {project.description} <br />
                        <strong>Deadline:</strong> {project.deadline} <br />
                        <strong>Members:</strong> {project.members.join(", ")}
                    </li>
                ))}
            </ul>
        </div>
    );
}

function TeamMemberProjects() {

}

function AllProjects() {

}

function Progress(){

}

export default TeamLeaderProjects;