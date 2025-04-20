import React from 'react';
import Create_project from '../components/Create_project_button';
import TeamLeaderProjects from '../components/Projects';

function MainPage() {
    return (
        <div className="container">
            <Create_project />
            {/* if admin 
            <AllProjects />

            <TeamLeaderProjects />
            <TeamMemberProjects />

            <Progress />

            <TeamLeaderProjects />*/}
    
        </div>
    );
}

export default MainPage;