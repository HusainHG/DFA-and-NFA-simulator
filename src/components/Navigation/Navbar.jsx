import React from 'react';
import { useAutomata } from '../../context/AutomataContext';
import { BookOpen, Layers, Cpu } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const { state, dispatch } = useAutomata();

  return (
    <header className="navbar-container">
      <div className="navbar-left">
        <div className="logo-brand">
          <div className="logo-icon-wrapper">
            <Cpu size={18} className="logo-icon" />
          </div>
          <div className="logo-text">
            <span className="logo-title">AutomataStudio</span>
            <span className="logo-subtitle">Theory of Computation</span>
          </div>
        </div>
      </div>

      <div className="navbar-center">
        <nav className="nav-view-tabs">
          <button 
            className={`nav-tab-btn ${state.currentView === 'landing' ? 'active' : ''}`}
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'landing' })}
          >
            <BookOpen size={15} />
            <span>Theory & Guide</span>
          </button>
          <button 
            className={`nav-tab-btn ${state.currentView === 'visualizer' ? 'active' : ''}`}
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'visualizer' })}
          >
            <Layers size={15} />
            <span>Visualizer</span>
          </button>
        </nav>
      </div>

      <div className="navbar-right">
        {/* Right side kept clean and minimal; reset button moved to sidebar */}
      </div>
    </header>
  );
}
