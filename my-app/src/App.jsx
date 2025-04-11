import MainPage from './pages/Main_page';
import ProjectCreation1 from './pages/Project_creation1';
import ProjectCreation2 from './pages/Project_creation2';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


function App() {
    /*const [messages, setMessages] = useState([]);  
  
    // periodically refresh (timer)
    useEffect(() => {
      setMessages(getMessages());
      const fetchMessagesInterval = setInterval(() => {
        setMessages(getMessages());
      }, 1000);
      return () => clearInterval(fetchMessagesInterval);
    }, []);*/

    
  
    return (
  
      <div className="container">
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={<MainPage />}
            />
            <Route
              path="/create"
              element={<ProjectCreation1/>}
            />
            <Route
              path="/create2"
              element={<ProjectCreation2/>}
            />
            {/*
            <Route
              path="/project"
              element={<ProjectAssignments/>}
            />
            
            <Route
              path="/assignment"
              element={<Assignment/>}
            />
            <Route
              path="/completion"
              element={<AssignmentCompletion/>}
            />
            <Route
              path="/bugreport"
              element={<BugReport/>}
            />
            <Route
              path="/newleader"
              element={<NewTeamLeader/>}
            />
            */}
          </Routes>
        </BrowserRouter>
        
      
      
      
        {/*<Header messages={messages} />
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={<MessageListPage messages={messages} />}
            />
            <Route
              path="/compose"
              element={<NewMessagePage setMessages={setMessages} />}
            />
          </Routes>
        </BrowserRouter>*/}
      </div>
    )
  
  }

  export default App