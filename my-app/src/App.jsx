import MainPage from './pages/Main_page';
import {ProjectCreation1, ProjectCreation2} from './pages/Project_creation1';
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
              element={<MainPage variables={variables} />}
            />
            <Route
              path="/create"
              element={<ProjectCreation1 variables={variables}/>}
            />
            <Route
              path="/create2"
              element={<ProjectCreation2 variables={variables}/>}
            />
            <Route
              path="/project"
              element={<ProjectAssignments variables={variables}/>}
            />
            <Route
              path="/assignment"
              element={<Assignment variables={variables}/>}
            />
            <Route
              path="/completion"
              element={<AssignmentCompletion variables={variables}/>}
            />
            <Route
              path="/bugreport"
              element={<BugReport variables={variables}/>}
            />
            <Route
              path="/newleader"
              element={<NewTeamLeader variables={variables}/>}
            />
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