import React from 'react';
import Create_project from '../components/Create_project_button';

function MainPage() {
    return (
        <div className="container">
            <Create_project />
            {/* if admin 
            <AllProjects />

            <TeamLeaderProjects />
            <TeamMemberProjects />

            <Progress />*/}
        </div>
    );
}

export default MainPage;