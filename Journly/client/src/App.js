import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import './App.css';
import { UserProvider } from "./providers/UserProvider";
import Header from "./components/Header";
import ApplicationViews from "./components/ApplicationViews";
import { PostProvider } from './providers/PostProvider';

function App() {
  return (
    <Router>
      <UserProvider>
        <PostProvider>
          <Header />
          <ApplicationViews />
        </PostProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
