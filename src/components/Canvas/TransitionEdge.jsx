import React from 'react';

const NODE_RADIUS = 30;

export default function TransitionEdge({ from, to, label, isBidirectional, curveOffset = 0 }) {
  if (from.id === to.id) {
    // Self loop
    const r = NODE_RADIUS;
    const cx = from.x;
    const cy = from.y;
    // Arc starts from top-left of the node and ends at top-right
    return (
      <g className="transition-edge">
        <path 
          d={`M ${cx - 15} ${cy - r + 5} C ${cx - 40} ${cy - r - 60}, ${cx + 40} ${cy - r - 60}, ${cx + 15} ${cy - r + 5}`} 
          fill="none" 
          stroke="var(--edge-stroke)" 
          strokeWidth="2" 
          markerEnd="url(#arrowhead)" 
        />
        <text 
          x={cx} 
          y={cy - r - 36} 
          fill="#0f172a" 
          textAnchor="middle"
          fontSize="13px"
          fontWeight="700"
          paintOrder="stroke fill"
          stroke="#f8fafc"
          strokeWidth="6px"
          strokeLinejoin="round"
        >
          {label}
        </text>
      </g>
    );
  }

  // Straight or curved edge between different nodes
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  
  if (dist === 0) return null;

  // Unit vector
  const ux = dx / dist;
  const uy = dy / dist;

  // Calculate start and end points on the edge of the circles
  let startX = from.x + ux * NODE_RADIUS;
  let startY = from.y + uy * NODE_RADIUS;
  let endX = to.x - ux * (NODE_RADIUS + 5); // +5 for arrowhead
  let endY = to.y - uy * (NODE_RADIUS + 5);

  let pathD = '';
  let textX = 0;
  let textY = 0;

  const effectiveOffset = curveOffset !== 0 ? curveOffset : (isBidirectional ? 32 : 0);

  if (effectiveOffset !== 0) {
    // Curve the path
    const cx = (from.x + to.x) / 2 - uy * effectiveOffset;
    const cy = (from.y + to.y) / 2 + ux * effectiveOffset;

    pathD = `M ${startX} ${startY} Q ${cx} ${cy} ${endX} ${endY}`;
    // Position text slightly further along curve peak
    textX = cx - uy * 10;
    textY = cy + ux * 10 - 2;
  } else {
    // Straight line
    pathD = `M ${startX} ${startY} L ${endX} ${endY}`;
    
    // Calculate normal vector (-uy, ux) so label sits strictly above arrow
    let nx = -uy;
    let ny = ux;
    if (ny > 0 || (Math.abs(ny) < 0.01 && nx < 0)) {
      nx = -nx;
      ny = -ny;
    }
    const offsetDist = 14;
    textX = (startX + endX) / 2 + nx * offsetDist;
    textY = (startY + endY) / 2 + ny * offsetDist;
  }

  return (
    <g className="transition-edge">
      <path 
        d={pathD} 
        fill="none" 
        stroke="var(--edge-stroke)" 
        strokeWidth="2" 
        markerEnd="url(#arrowhead)" 
      />
      <text 
        x={textX} 
        y={textY} 
        fill="#0f172a" 
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="13px"
        fontWeight="700"
        paintOrder="stroke fill"
        stroke="#f8fafc"
        strokeWidth="6px"
        strokeLinejoin="round"
      >
        {label}
      </text>
    </g>
  );
}
