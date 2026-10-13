import React, { useState, useRef, useEffect } from 'react';
import { useAutomata } from '../../context/AutomataContext';
import { DFA_PRESETS, NFA_PRESETS } from '../../utils/presets';
import TransitionTable from './TransitionTable';
import { Sparkles, Sliders, RotateCcw, ChevronDown, Check } from 'lucide-react';
import './TransitionPanel.css';

export default function TransitionPanel() {
  const { state, dispatch } = useAutomata();
  const [isEnlarged, setIsEnlarged] = useState(false);
  const [isModeOpen, setIsModeOpen] = useState(false);
  const modeDropdownRef = useRef(null);

  const presets = state.mode === 'DFA' ? DFA_PRESETS : NFA_PRESETS;

  const initialCount = state.states.filter(s => s.isInitial).length;
  const finalCount = state.states.filter(s => s.isFinal).length;

  // Close custom dropdown on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (modeDropdownRef.current && !modeDropdownRef.current.contains(e.target)) {
        setIsModeOpen(false);
      }
    };
    if (isModeOpen) {
      document.addEventListener('mousedown', handleOutside);
    }
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [isModeOpen]);

  const handleSelectMode = (modeVal) => {
    dispatch({ type: 'SET_MODE', payload: modeVal });
    setIsModeOpen(false);
  };

  return (
    <>
      <div className="panel-pane">
        <div className="panel-header">
          <div className="panel-header-top">
            <div className="panel-title-wrap">
              <Sliders size={16} className="panel-icon" />
              <h2>Automata Designer</h2>
            </div>
          </div>

          <div className="panel-controls-row">
            <div className="mode-toggle-custom" ref={modeDropdownRef}>
              <button 
                type="button"
                className={`panel-mode-btn ${isModeOpen ? 'open' : ''}`}
                onClick={() => setIsModeOpen(!isModeOpen)}
                aria-expanded={isModeOpen}
              >
                <span className="selected-mode-text">
                  {state.mode === 'DFA' 
                    ? 'Deterministic Finite Automata (DFA)' 
                    : 'Non-Deterministic Finite Automata (NFA)'}
                </span>
                <ChevronDown size={14} className={`dropdown-chevron ${isModeOpen ? 'rotated' : ''}`} />
              </button>

              {isModeOpen && (
                <div className="custom-mode-dropdown-menu">
                  <div 
                    className={`custom-mode-option ${state.mode === 'DFA' ? 'active' : ''}`}
                    onClick={() => handleSelectMode('DFA')}
                  >
                    <div className="option-label-group">
                      <span className="option-name">Deterministic Finite Automata (DFA)</span>
                      <span className="option-hint">Exactly one transition per symbol</span>
                    </div>
                    {state.mode === 'DFA' && <Check size={14} className="option-check" />}
                  </div>

                  <div 
                    className={`custom-mode-option ${state.mode === 'NFA' ? 'active' : ''}`}
                    onClick={() => handleSelectMode('NFA')}
                  >
                    <div className="option-label-group">
                      <span className="option-name">Non-Deterministic Finite Automata (NFA)</span>
                      <span className="option-hint">Branch to 0, 1, or multiple states</span>
                    </div>
                    {state.mode === 'NFA' && <Check size={14} className="option-check" />}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Example Buttons (without "Max 5 states" line) */}
          <div className="panel-examples-section">
            <div className="panel-examples-title">
              <Sparkles size={12} />
              <span>Examples:</span>
            </div>
            <div className="panel-examples-buttons">
              {presets.map((preset, idx) => (
                <button
                  key={preset.id}
                  type="button"
                  className="panel-preset-btn"
                  title={preset.description}
                  onClick={() => dispatch({ type: 'LOAD_PRESET', payload: preset })}
                >
                  <span className="preset-number">Ex {idx + 1}</span>
                  <span className="preset-text">{preset.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Transition Table */}
        <TransitionTable isEnlarged={false} toggleEnlarge={() => setIsEnlarged(true)} />

        {/* Sidebar Bottom: Metrics and Reset Button */}
        <div className="panel-bottom-footer">
          <div className="panel-metrics-grid">
            <div className="panel-metric-item">
              <span className="metric-label">Alphabet</span>
              <span className="metric-val">{state.inputs.length} symbols (Σ = {'{'}{state.inputs.join(', ')}{'}'})</span>
            </div>
            <div className="panel-metric-item">
              <span className="metric-label">States</span>
              <span className="metric-val">{state.states.length} total ({initialCount} init, {finalCount} final)</span>
            </div>
          </div>

          <div className="panel-footer-actions">
            <button 
              type="button"
              className="panel-footer-btn panel-reset-btn"
              onClick={() => dispatch({ type: 'RESET_AUTOMATON' })}
              title="Clear canvas and reset all automaton parameters"
            >
              <RotateCcw size={14} />
              <span>Reset Automaton</span>
            </button>
          </div>
        </div>
      </div>

      {isEnlarged && (
        <div className="enlarged-table-overlay" onClick={() => setIsEnlarged(false)}>
          <div className="enlarged-table-container" onClick={(e) => e.stopPropagation()}>
            <TransitionTable isEnlarged={true} toggleEnlarge={() => setIsEnlarged(false)} />
          </div>
        </div>
      )}
    </>
  );
}
