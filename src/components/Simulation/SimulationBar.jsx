import React, { useState, useEffect } from 'react';
import { useAutomata } from '../../context/AutomataContext';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, CheckCircle2, XCircle, Activity } from 'lucide-react';
import './SimulationBar.css';

export default function SimulationBar() {
  const { state, dispatch } = useAutomata();
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying) return;

    if (state.simStatus === 'accepted' || state.simStatus === 'rejected' || state.simStep >= state.simString.length) {
      const timeout = setTimeout(() => setIsPlaying(false), 0);
      return () => clearTimeout(timeout);
    }

    const timer = setInterval(() => {
      dispatch({ type: 'SIM_STEP_FORWARD' });
    }, 750);

    return () => clearInterval(timer);
  }, [isPlaying, state.simStep, state.simString.length, state.simStatus, dispatch]);

  const handleStringChange = (e) => {
    setIsPlaying(false);
    dispatch({ type: 'SET_SIM_STRING', payload: e.target.value });
  };

  const handleReset = () => {
    setIsPlaying(false);
    dispatch({ type: 'SIM_RESET' });
  };

  const handleStepForward = () => {
    setIsPlaying(false);
    dispatch({ type: 'SIM_STEP_FORWARD' });
  };

  const handleStepBack = () => {
    setIsPlaying(false);
    dispatch({ type: 'SIM_STEP_BACKWARD' });
  };

  const togglePlay = () => {
    if (state.simStatus === 'accepted' || state.simStatus === 'rejected' || state.simStep >= state.simString.length) {
      dispatch({ type: 'SIM_RESET' });
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const activeStateNames = state.states
    .filter(s => state.simActiveStates.includes(s.id))
    .map(s => s.name);

  return (
    <div className="simulation-bar-container">
      <div className="sim-left-controls">
        <div className="sim-input-wrapper">
          <label htmlFor="sim-input-field" className="sim-input-label">Test String:</label>
          <input 
            id="sim-input-field"
            type="text"
            className="sim-input-field"
            value={state.simString}
            onChange={handleStringChange}
            placeholder="e.g. 0100"
          />
        </div>

        <div className="sim-buttons-group">
          <button 
            className="sim-btn" 
            onClick={handleReset} 
            title="Reset simulation tape to starting state"
          >
            <RotateCcw size={14} />
            <span>Reset Tape</span>
          </button>
          
          <button 
            className="sim-btn" 
            onClick={handleStepBack} 
            disabled={state.simStep <= 0}
            title="Step Back one symbol"
          >
            <SkipBack size={14} />
            <span>Back</span>
          </button>

          <button 
            className={`sim-btn ${isPlaying ? 'sim-btn-active' : ''}`}
            onClick={togglePlay} 
            title={isPlaying ? "Pause simulation" : "Auto play step-by-step"}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          <button 
            className="sim-btn" 
            onClick={handleStepForward} 
            disabled={state.simStep >= state.simString.length && state.simStep >= 0}
            title="Step forward one symbol"
          >
            <SkipForward size={14} />
            <span>Step</span>
          </button>
        </div>
      </div>

      <div className="sim-center-visualizer">
        <div className="sim-string-display">
          <span className="sim-str-label">Input Tape:</span>
          <div className="sim-tape-cells">
            {state.simString.length === 0 ? (
              <span className="tape-empty">ε (empty string)</span>
            ) : (
              state.simString.split('').map((char, index) => {
                let cellClass = 'tape-cell';
                if (state.simStep > index) cellClass += ' consumed';
                if (state.simStep === index) cellClass += ' current';
                return (
                  <span key={index} className={cellClass}>
                    {char}
                  </span>
                );
              })
            )}
          </div>
        </div>

        <div className="sim-active-states">
          <Activity size={14} className="pulse-icon" />
          <span className="active-label">Active:</span>
          {activeStateNames.length > 0 ? (
            <div className="active-chips">
              {activeStateNames.map(name => (
                <span key={name} className="active-chip">{name}</span>
              ))}
            </div>
          ) : (
            <span className="no-active-chip">∅ (Dead end)</span>
          )}
        </div>
      </div>

      <div className="sim-right-status">
        {state.simStatus === 'accepted' && (
          <div className="status-badge accepted">
            <CheckCircle2 size={15} />
            <span>ACCEPTED</span>
          </div>
        )}
        {state.simStatus === 'rejected' && (
          <div className="status-badge rejected">
            <XCircle size={15} />
            <span>REJECTED</span>
          </div>
        )}
        {state.simStatus === 'in_progress' && (
          <div className="status-badge in-progress">
            <span>Step {state.simStep} / {state.simString.length}</span>
          </div>
        )}
        {state.simStatus === 'idle' && (
          <div className="status-badge idle">
            <span>Ready</span>
          </div>
        )}
      </div>
    </div>
  );
}
