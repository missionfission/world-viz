import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="header">
      <h1>World Manufacturing & Logistics Visualization</h1>
      <nav>
        <Link to="/">Map View</Link>
        <Link to="/statistics">Statistics</Link>
      </nav>
    </header>
  );
};

export default Header;
