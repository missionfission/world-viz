import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WorldMap } from './components/WorldMap';
import Header from './components/Header';
import './App.css';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<WorldMap />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
