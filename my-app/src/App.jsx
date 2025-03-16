import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  return (
  <div>
  <Header />
  <MainContent />
  <Footer />
  <Parent />
  <Counter />
  <Timer />
  </div>
  );
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


function Header() {
  return <h1>Welcome to my website!</h1>
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
