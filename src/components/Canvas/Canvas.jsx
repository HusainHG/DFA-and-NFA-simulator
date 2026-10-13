import React, { useState, useRef, useEffect } from 'react';
import { useAutomata } from '../../context/AutomataContext';
import StateNode from './StateNode';
import TransitionEdge from './TransitionEdge';
import ContextMenu from '../ContextMenu/ContextMenu';
import { Info, Move, MousePointerClick, Sparkles } from 'lucide-react';
import './Canvas.css';

export default function Canvas() {
  const { state, dispatch } = useAutomata();
  const svgRef = useRef(null);
  
  const [draggingNode, setDraggingNode] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);

  // Group transitions by from-to pair to draw multiple inputs on one edge
  const edges = [];
  const transitionGroups = {}; // key: fromId-toId, value: array of inputs
  
  Object.keys(state.transitions).forEach(fromId => {
    Object.keys(state.transitions[fromId]).forEach(input => {
      const toIds = state.transitions[fromId][input];
      toIds.forEach(toId => {
        const key = `${fromId}-${toId}`;
        if (!transitionGroups[key]) transitionGroups[key] = [];
        if (!transitionGroups[key].includes(input)) {
          transitionGroups[key].push(input);
        }
      });
    });
  });

  Object.keys(transitionGroups).forEach(key => {
    const [fromId, toId] = key.split('-');
    const fromState = state.states.find(s => s.id === fromId);
    const toState = state.states.find(s => s.id === toId);
    
    if (fromState && toState) {
      const isBidi = transitionGroups[`${toId}-${fromId}`] !== undefined;
      let curveOffset = 0;

      if (isBidi) {
        curveOffset = 34;
      } else if (fromId !== toId) {
        // Check if straight edge line segment passes through or near another node
        const dx = toState.x - fromState.x;
        const dy = toState.y - fromState.y;
        const lenSq = dx * dx + dy * dy;

        if (lenSq > 0) {
          for (const other of state.states) {
            if (other.id === fromId || other.id === toId) continue;
            const t = ((other.x - fromState.x) * dx + (other.y - fromState.y) * dy) / lenSq;
            if (t > 0.08 && t < 0.92) {
              const projX = fromState.x + t * dx;
              const projY = fromState.y + t * dy;
              const dist = Math.hypot(other.x - projX, other.y - projY);
              if (dist < 46) {
                // Collides! Curve away from the obstacle
                const cross = dx * (other.y - fromState.y) - dy * (other.x - fromState.x);
                curveOffset = cross >= 0 ? -52 : 52;
                break;
              }
            }
          }
        }

        // Backward transition running along similar horizontal level
        if (curveOffset === 0 && toState.x < fromState.x - 30 && Math.abs(toState.y - fromState.y) < 70) {
          curveOffset = 38;
        }
      }

      edges.push({
        from: fromState,
        to: toState,
        label: transitionGroups[key].join(', '),
        curveOffset,
        isBidirectional: isBidi
      });
    }
  });

  const handleMouseDown = (e, id) => {
    if (e.button === 0) { // Left click only
      setDraggingNode(id);
    }
  };

  const handleDoubleClick = (e, id) => {
    e.stopPropagation();
    dispatch({ type: 'TOGGLE_FINAL_STATE', payload: { id } });
  };

  const handleMouseMove = (e) => {
    if (draggingNode && svgRef.current) {
      const pt = svgRef.current.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const svgP = pt.matrixTransform(svgRef.current.getScreenCTM().inverse());
      
      dispatch({ 
        type: 'MOVE_STATE', 
        payload: { id: draggingNode, x: svgP.x, y: svgP.y } 
      });
    }
  };

  const handleMouseUp = () => {
    setDraggingNode(null);
  };

  const handleContextMenu = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      stateId: id
    });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  useEffect(() => {
    const handleClickOutside = () => closeContextMenu();
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  // Dotted circle only appears when simulation is actively running/started!
  const isSimRunning = state.simStatus !== 'idle' && state.simStep >= 0;

  return (
    <div className="canvas-pane">
      <svg 
        ref={svgRef}
        width="100%" 
        height="100%" 
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onContextMenu={(e) => e.preventDefault()}
      >
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="var(--edge-stroke)" />
          </marker>
          <marker id="arrowhead-initial" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#0f172a" />
          </marker>
        </defs>

        {/* Draw edges first so they are behind nodes */}
        {edges.map((edge, idx) => (
          <TransitionEdge 
            key={`${edge.from.id}-${edge.to.id}-${idx}`}
            from={edge.from} 
            to={edge.to} 
            label={edge.label}
            isBidirectional={edge.isBidirectional}
            curveOffset={edge.curveOffset}
          />
        ))}

        {/* Draw nodes */}
        {state.states.map(s => (
          <StateNode 
            key={s.id} 
            state={s} 
            isActive={isSimRunning && state.simActiveStates.includes(s.id)}
            onMouseDown={(e) => handleMouseDown(e, s.id)}
            onDoubleClick={(e) => handleDoubleClick(e, s.id)}
            onContextMenu={(e) => handleContextMenu(e, s.id)}
          />
        ))}
      </svg>

      {/* Empty State Overlay */}
      {state.states.length === 0 && (
        <div className="canvas-empty-overlay">
          <div className="canvas-empty-card">
            <h4>Automaton Canvas is Blank</h4>
            <p>Click <strong>+ Add State</strong> in the right sidebar or load an example to begin.</p>
          </div>
        </div>
      )}

      {/* Canvas bottom hint banner with Auto Rearrange button */}
      <div className="canvas-bottom-toolbar">
        <button 
          className="canvas-action-btn auto-rearrange-btn"
          onClick={() => dispatch({ type: 'AUTO_REARRANGE' })}
          title="Automatically organize nodes with balanced layout"
        >
          <Sparkles size={13} />
          <span>Auto Rearrange</span>
        </button>

        <div className="canvas-hint-pill">
          <span className="hint-item"><Move size={12} /> Drag nodes</span>
          <span className="hint-divider">•</span>
          <span className="hint-item"><MousePointerClick size={12} /> Double-click: Toggle Final</span>
          <span className="hint-divider">•</span>
          <span className="hint-item"><Info size={12} /> Right-click: Options</span>
        </div>
      </div>

      {contextMenu && (
        <ContextMenu 
          x={contextMenu.x} 
          y={contextMenu.y} 
          stateId={contextMenu.stateId} 
          onClose={closeContextMenu} 
        />
      )}
    </div>
  );
}
