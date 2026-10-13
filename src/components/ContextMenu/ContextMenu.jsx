import React from 'react';
import { useAutomata } from '../../context/AutomataContext';
import { CheckCircle2, Circle, Trash2, ArrowRightCircle } from 'lucide-react';
import './ContextMenu.css';

export default function ContextMenu({ x, y, stateId, onClose }) {
  const { state, dispatch } = useAutomata();
  const node = state.states.find(s => s.id === stateId);

  if (!node) return null;

  // Keep menu within viewport bounds
  const adjustedX = Math.min(x, window.innerWidth - 220);
  const adjustedY = Math.min(y, window.innerHeight - 180);

  return (
    <div 
      className="context-menu" 
      style={{ top: adjustedY, left: adjustedX }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="context-menu-header">
        <span className="context-state-badge">{node.name}</span>
        <span className="context-state-label">State Actions</span>
      </div>

      <div 
        className={`context-menu-item ${node.isInitial ? 'selected' : ''}`}
        onClick={() => {
          dispatch({ type: 'SET_INITIAL_STATE', payload: { id: stateId } });
          onClose();
        }}
      >
        <ArrowRightCircle size={15} className="menu-icon initial-icon" />
        <span>{node.isInitial ? 'Initial State (Active)' : 'Set as Initial State'}</span>
      </div>

      <div 
        className={`context-menu-item ${node.isFinal ? 'selected' : ''}`}
        onClick={() => {
          dispatch({ type: 'TOGGLE_FINAL_STATE', payload: { id: stateId } });
          onClose();
        }}
      >
        {node.isFinal ? (
          <CheckCircle2 size={15} className="menu-icon final-icon" />
        ) : (
          <Circle size={15} className="menu-icon" />
        )}
        <span>{node.isFinal ? 'Final State (Active)' : 'Set as Final State'}</span>
      </div>

      <div className="context-menu-divider"></div>

      <div 
        className="context-menu-item danger"
        onClick={() => {
          dispatch({ type: 'REMOVE_STATE', payload: { id: stateId } });
          onClose();
        }}
      >
        <Trash2 size={15} className="menu-icon" />
        <span>Delete State</span>
      </div>
    </div>
  );
}
