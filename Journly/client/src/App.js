import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import './App.css';
import { UserProvider } from "./providers/UserProvider";
import Header from "./components/Header";
import ApplicationViews from "./components/ApplicationViews";

function App() {
  return (
    <Router>
      <UserProvider>
        <Header />
        <ApplicationViews />
      </UserProvider>
    </Router>
  );
}

export default App;
