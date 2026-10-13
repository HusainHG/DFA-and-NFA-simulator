import React from 'react';

const NODE_RADIUS = 30;

export default function StateNode({ state, isActive, onMouseDown, onContextMenu }) {
  return (
    <g 
      transform={`translate(${state.x}, ${state.y})`} 
      onMouseDown={onMouseDown}
      onContextMenu={onContextMenu}
      className={`state-node-group ${isActive ? 'active-node' : ''}`}
      style={{ cursor: 'pointer' }}
    >
      {/* Active pulse ring in sharp gray/black */}
      {isActive && (
        <circle 
          r={NODE_RADIUS + 7} 
          fill="none" 
          stroke="#0f172a" 
          strokeWidth="2" 
          strokeDasharray="4 2"
          className="active-ring"
        />
      )}

      {/* Initial Arrow */}
      {state.isInitial && (
        <g className="initial-arrow">
          <line 
            x1={-NODE_RADIUS - 38} 
            y1="0" 
            x2={-NODE_RADIUS - 4} 
            y2="0" 
            stroke="#0f172a" 
            strokeWidth="2.5" 
            markerEnd="url(#arrowhead-initial)" 
          />
          <text 
            x={-NODE_RADIUS - 42} 
            y="3" 
            fill="#64748b" 
            fontSize="10px" 
            fontWeight="700" 
            letterSpacing="0.05em"
            textAnchor="end"
          >
            START
          </text>
        </g>
      )}

      {/* Main Circle (Gray and White theme) */}
      <circle 
        r={NODE_RADIUS} 
        fill={isActive ? '#f1f5f9' : '#ffffff'} 
        stroke="#0f172a" 
        strokeWidth={isActive ? '2.5' : '2'} 
        className="state-node"
      />
      
      {/* Final State Inner Circle (Standard formal automata double circle) */}
      {state.isFinal && (
        <circle 
          r={NODE_RADIUS - 6} 
          fill="none" 
          stroke="#0f172a" 
          strokeWidth="2" 
        />
      )}

      {/* Label */}
      <text 
        textAnchor="middle" 
        dy=".35em" 
        fill="#0f172a"
        fontSize="15px"
        fontWeight="700"
        pointerEvents="none"
      >
        {state.name}
      </text>
    </g>
  );
}
