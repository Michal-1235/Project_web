import Header from './components/Header';
import { getMessages } from './services/messageService'
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MessageListPage from './pages/MessageListPage';
import NewMessagePage from './pages/NewMessagePage';

//import './App.css'

function App() {
  const [messages, setMessages] = useState([]);  

  // periodically refresh (timer)
  useEffect(() => {
    getMessages().then(
      (messages) => setMessages(messages)
    );

    const fetchMessagesInterval = setInterval(() => {
        getMessages().then(
          (messages) => setMessages(messages)
        );
      }, 1000);
    return () => clearInterval(fetchMessagesInterval);
  }, []);

  return (

    <div className="container">
    
    <MainContent />
    <Footer />
    <Parent />
    <Counter />
    <Timer />
    
      <Header messages={messages} />
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
      </BrowserRouter>
    </div>
  )

}



function Timer() {
  const [count, setCount] = useState(0);
  useEffect(() => {
  // create the interval to increment the count
  const intervalId = setInterval(() => {
  setCount(prevCount => prevCount + 1);
  }, 1000); // 1 second
  return () => clearInterval(intervalId); // clear the interval on unmount
  }, []); // empty dependency array - this effect runs once on mount
  return (
  <div>
  <h1>Count: {count}</h1>
  </div>
  );
}

function Parent() {
  const parentData = "Hello from Parent";
  return (
  <div>
  <h1>Parent Component</h1>
  <Child data={parentData} />
  </div>
  );
}

function Child(props) {
  return (
  <div>
  <h2>Child Component</h2>
  <p>{props.data}</p>
  </div>
  );
}

function Counter() {
  const [count, setCount] = useState(0);

  // useEffect hook to update the document title whenever 'count' changes
  useEffect(() => {
  document.title = `You clicked ${count} times`;
  }, [count]); // Dependency array, useEffect will run when 'count' changes

  return (
  <div>
  <h1>Counter: {count}</h1>
  <button onClick={() => setCount(count + 5)}>Increment</button>
  <Child data={count} />
  </div>
  );
}



function Sidebar() {
  return <div>Sidebar content</div>
}

function Article() {
  return <div>This is the main content of the
  page.</div>
}

function MainContent() {
  return (
  <>
  <Sidebar />
  <Article />
  </>
  )
}

function Footer() {
  return <span>&#169; 2025 All rights reserved</span>
}







export default App
