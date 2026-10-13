import React, { useState, useRef, useEffect } from 'react';
import { useAutomata } from '../../context/AutomataContext';
import { 
  Plus, 
  Trash2, 
  Maximize2, 
  Minimize2, 
  X, 
  MoreVertical, 
  Check, 
  ArrowRight,
  Disc
} from 'lucide-react';
import './TransitionTable.css';

function NfaTransitionCell({ fromId, input, currentTargets, allStates, onAdd, onRemove }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const availableStates = allStates.filter(s => !currentTargets.includes(s.id));

  useEffect(() => {
    const handleOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutside);
    }
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [isOpen]);

  return (
    <div className="nfa-cell-wrapper" ref={containerRef}>
      <div className="nfa-chips-container">
        {currentTargets.length === 0 ? (
          <span className="nfa-empty-dash">-</span>
        ) : (
          currentTargets.map(tId => {
            const st = allStates.find(s => s.id === tId);
            return (
              <span key={tId} className="nfa-state-chip">
                <span className="chip-label">{st ? st.name : tId}</span>
                <button
                  type="button"
                  className="nfa-chip-remove"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(fromId, input, tId);
                  }}
                  title="Remove target"
                >
                  <X size={10} />
                </button>
              </span>
            );
          })
        )}
      </div>

      {/* On hover over the cell, plus icon button appears */}
      {availableStates.length > 0 && (
        <button
          type="button"
          className="nfa-add-plus-btn"
          onClick={() => setIsOpen(!isOpen)}
          title="Add state to cell"
        >
          <Plus size={12} />
        </button>
      )}

      {/* Dropdown with curved corners and clean light background */}
      {isOpen && (
        <div className="nfa-dropdown-menu">
          <div className="nfa-dropdown-header">Add target:</div>
          <div className="nfa-dropdown-items-list">
            {availableStates.map(st => (
              <div
                key={st.id}
                className="nfa-dropdown-item"
                onClick={() => {
                  onAdd(fromId, input, st.id);
                  setIsOpen(false);
                }}
              >
                <span className="nfa-dropdown-state-pill">{st.name}</span>
                {st.isInitial && <span className="nfa-meta-tag initial">Init</span>}
                {st.isFinal && <span className="nfa-meta-tag final">Final</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TransitionTable({ isEnlarged, toggleEnlarge }) {
  const { state, dispatch } = useAutomata();
  const [newInput, setNewInput] = useState('');
  const [showAddInput, setShowAddInput] = useState(false);
  const [activeMenuStateId, setActiveMenuStateId] = useState(null);
  const menuContainerRef = useRef(null);
  const addInputRef = useRef(null);

  // Close 3-dots dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuContainerRef.current && !menuContainerRef.current.contains(e.target)) {
        setActiveMenuStateId(null);
      }
    };
    if (activeMenuStateId) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeMenuStateId]);

  const handleAddInput = (e) => {
    e.preventDefault();
    const trimmed = newInput.trim();
    if (trimmed && !state.inputs.includes(trimmed)) {
      dispatch({ type: 'ADD_INPUT', payload: { inputSymbol: trimmed } });
      setNewInput('');
      setShowAddInput(false);
    }
  };

  const handleDfaTransitionChange = (fromId, input, targetVal) => {
    dispatch({
      type: 'SET_TRANSITION',
      payload: { fromId, input, toIds: targetVal ? [targetVal] : [] }
    });
  };

  const handleAddNfaTarget = (fromId, input, targetId) => {
    dispatch({
      type: 'ADD_TRANSITION_TARGET',
      payload: { fromId, input, targetId }
    });
  };

  const handleRemoveNfaTarget = (fromId, input, targetId) => {
    dispatch({
      type: 'REMOVE_TRANSITION_TARGET',
      payload: { fromId, input, targetId }
    });
  };

  return (
    <div className={`transition-table-wrapper ${isEnlarged ? 'enlarged' : ''}`}>
      <div className="table-header-actions">
        <div className="table-title-meta">
          <h3>Transition Table</h3>
          <span className="table-mode-badge">{state.mode}</span>
        </div>
        <button 
          className="btn-icon" 
          onClick={toggleEnlarge} 
          title={isEnlarged ? "Minimize" : "Enlarge Table"}
        >
          {isEnlarged ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>

      <div className="table-scroll-container">
        <table className="transition-table">
          <thead>
            <tr>
              {/* Direct State heading */}
              <th className="th-state-col">State</th>
              
              {/* Direct Input headings */}
              {state.inputs.map(input => (
                <th key={input} className="th-input-col">
                  <div className="th-content">
                    <span className="input-symbol-tag">{input}</span>
                    <button 
                      className="btn-icon-small delete-btn"
                      title={`Remove input symbol "${input}"`}
                      onClick={() => dispatch({ type: 'REMOVE_INPUT', payload: { inputSymbol: input } })}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </th>
              ))}
              
              {/* Add Column button on right side of last column */}
              <th className="th-add-col">
                <div className="add-col-wrap">
                  {showAddInput ? (
                    <form onSubmit={handleAddInput} className="add-input-inline-form">
                      <input 
                        ref={addInputRef}
                        type="text" 
                        value={newInput} 
                        onChange={e => setNewInput(e.target.value)} 
                        placeholder="Sym" 
                        maxLength={3}
                        autoFocus
                      />
                      <button type="submit" className="btn-confirm-add" title="Confirm symbol"><Check size={12}/></button>
                      <button type="button" className="btn-cancel-add" onClick={() => setShowAddInput(false)} title="Cancel"><X size={12}/></button>
                    </form>
                  ) : (
                    <button 
                      type="button" 
                      className="btn-add-col-trigger" 
                      onClick={() => setShowAddInput(true)}
                      title="Add input column"
                    >
                      <Plus size={14}/>
                    </button>
                  )}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {state.states.length === 0 ? (
              <tr>
                <td colSpan={state.inputs.length + 2} className="td-empty-table-msg">
                  No states created. Click "+ Add State" below to begin.
                </td>
              </tr>
            ) : (
              state.states.map(s => (
                <tr key={s.id}>
                  {/* State Column with 3 dots on hover */}
                  <td className="td-state-col">
                  <div className="state-cell">
                    <div className="state-indicators-wrap">
                      {s.isInitial && <span className="state-type-badge init" title="Initial State">→</span>}
                      {s.isFinal && <span className="state-type-badge final" title="Final State">◎</span>}
                    </div>

                    <input 
                      type="text"
                      className="state-name-input"
                      value={s.name}
                      title="Edit state label"
                      onChange={(e) => dispatch({ type: 'UPDATE_STATE_NAME', payload: { id: s.id, name: e.target.value } })}
                    />

                    {/* 3 dots icon button visible on hover */}
                    <div className="state-menu-container" ref={activeMenuStateId === s.id ? menuContainerRef : null}>
                      <button 
                        type="button"
                        className={`state-menu-trigger-btn ${activeMenuStateId === s.id ? 'active' : ''}`}
                        title="State options"
                        onClick={() => setActiveMenuStateId(activeMenuStateId === s.id ? null : s.id)}
                      >
                        <MoreVertical size={14} />
                      </button>

                      {/* Dropdown Menu under 3 dots */}
                      {activeMenuStateId === s.id && (
                        <div className="state-options-dropdown">
                          <div className="state-dropdown-section-title">Mark as:</div>
                          
                          <div 
                            className={`state-dropdown-item ${s.isInitial ? 'selected' : ''}`}
                            onClick={() => {
                              dispatch({ type: 'SET_INITIAL_STATE', payload: { id: s.id } });
                              setActiveMenuStateId(null);
                            }}
                          >
                            <div className="item-label-wrap">
                              <ArrowRight size={13} className="item-icon" />
                              <span>Initial State</span>
                            </div>
                            {s.isInitial && <Check size={13} className="item-check" />}
                          </div>

                          <div 
                            className={`state-dropdown-item ${s.isFinal ? 'selected' : ''}`}
                            onClick={() => {
                              dispatch({ type: 'TOGGLE_FINAL_STATE', payload: { id: s.id } });
                              setActiveMenuStateId(null);
                            }}
                          >
                            <div className="item-label-wrap">
                              <Disc size={13} className="item-icon" />
                              <span>Final State</span>
                            </div>
                            {s.isFinal && <Check size={13} className="item-check" />}
                          </div>

                          <div className="state-dropdown-divider"></div>

                          <div 
                            className="state-dropdown-item danger"
                            onClick={() => {
                              dispatch({ type: 'REMOVE_STATE', payload: { id: s.id } });
                              setActiveMenuStateId(null);
                            }}
                          >
                            <div className="item-label-wrap">
                              <Trash2 size={13} className="item-icon" />
                              <span>Delete State</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Transition Cells */}
                {state.inputs.map(input => (
                  <td key={input} className="td-transition-col">
                    {state.mode === 'DFA' ? (
                      <div className="dfa-select-wrapper">
                        <select 
                          className="dfa-state-select"
                          value={state.transitions[s.id]?.[input]?.[0] || ''} 
                          onChange={(e) => handleDfaTransitionChange(s.id, input, e.target.value)}
                        >
                          <option value="">-</option>
                          {state.states.map(ts => (
                            <option key={ts.id} value={ts.id}>
                              {ts.name} {ts.isFinal ? '◎' : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <NfaTransitionCell 
                        fromId={s.id}
                        input={input}
                        currentTargets={state.transitions[s.id]?.[input] || []}
                        allStates={state.states}
                        onAdd={handleAddNfaTarget}
                        onRemove={handleRemoveNfaTarget}
                      />
                    )}
                  </td>
                ))}

                {/* Right empty column aligned with add button */}
                <td className="td-add-col-placeholder"></td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
      
      <div className="table-footer">
        <button 
          className="btn-primary" 
          onClick={() => dispatch({ type: 'ADD_STATE' })}
        >
          <Plus size={15} style={{marginRight: '6px'}} /> Add State
        </button>
      </div>
    </div>
  );
}
