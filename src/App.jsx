import React from 'react';
import { AutomataProvider, useAutomata } from './context/AutomataContext';
import Navbar from './components/Navigation/Navbar';
import Canvas from './components/Canvas/Canvas';
import TransitionPanel from './components/Panel/TransitionPanel';
import SimulationBar from './components/Simulation/SimulationBar';
import LandingPage from './components/Landing/LandingPage';
import './App.css';

function MainLayout() {
  const { state } = useAutomata();

  return (
    <div className="app-container">
      <Navbar />
      
      {state.currentView === 'landing' ? (
        <LandingPage />
      ) : (
        <div className="app-workspace">
          <div className="workspace-main">
            <Canvas />
            <SimulationBar />
          </div>
          <TransitionPanel />
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <AutomataProvider>
      <MainLayout />
    </AutomataProvider>
  );
}

export default App;
