import Create_project from './components/Create_project';

function MainPage() {
    <div className="container">
        <Create_project />
        {/* if admin */}
        <AllProjects />
        {/* else */}
        <TeamLeaderProjects />
        <TeamMemberProjects />

        <Progress />
    </div>

}

export default MainPage;