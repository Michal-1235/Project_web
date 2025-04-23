import React from 'react';
import Create_project from '../components/Create_project_button';
import TeamLeaderProjects from '../components/Projects';

function MainPage({adminStatus}) {
    return (
        <div className="container">
            <Create_project />
            {/* if addmin 
            <AllProjects />
            
            else
            <TeamLeaderProjects />
            <TeamMemberProjects />

            <Progress />*/}
    
        </div>
    );
}

export default MainPage;