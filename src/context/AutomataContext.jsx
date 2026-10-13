import React, { createContext, useReducer, useContext } from 'react';
import { DFA_PRESETS, NFA_PRESETS } from '../utils/presets';

const AutomataContext = createContext();

const initialAutomata = DFA_PRESETS[0];

const initialState = {
  mode: initialAutomata.mode,
  states: initialAutomata.states,
  inputs: initialAutomata.inputs,
  transitions: initialAutomata.transitions,
  stateCounter: initialAutomata.stateCounter,
  currentView: 'landing', // 'landing' | 'visualizer'
  // Simulation state
  simString: initialAutomata.sampleString,
  simStep: -1, // -1: idle/not started, 0: at start (0 chars read), 1: 1 char read, etc.
  simActiveStates: initialAutomata.states.filter(s => s.isInitial).map(s => s.id),
  simStatus: 'idle', // 'idle' | 'in_progress' | 'accepted' | 'rejected'
  simHistory: [] // stores previous activeStates for step backward
};

// Helper to evaluate acceptance given active states and states array
function checkAcceptance(activeStateIds, states) {
  if (!activeStateIds || activeStateIds.length === 0) return false;
  const finalStateIds = new Set(states.filter(s => s.isFinal).map(s => s.id));
  return activeStateIds.some(id => finalStateIds.has(id));
}

// Helper to compute next states for a symbol
function computeNextStates(fromStateIds, symbol, transitions) {
  const nextSet = new Set();
  fromStateIds.forEach(fromId => {
    const targets = transitions[fromId]?.[symbol] || [];
    targets.forEach(t => nextSet.add(t));
  });
  return Array.from(nextSet);
}

function automataReducer(state, action) {
  switch (action.type) {
    case 'SET_VIEW': {
      return { ...state, currentView: action.payload };
    }

    case 'SET_MODE': {
      const newMode = action.payload;
      // Load first preset for this mode
      const defaultPreset = newMode === 'DFA' ? DFA_PRESETS[0] : NFA_PRESETS[0];
      const initialIds = defaultPreset.states.filter(s => s.isInitial).map(s => s.id);
      return {
        ...state,
        mode: newMode,
        states: defaultPreset.states,
        inputs: defaultPreset.inputs,
        transitions: defaultPreset.transitions,
        stateCounter: defaultPreset.stateCounter,
        simString: defaultPreset.sampleString,
        simStep: -1,
        simActiveStates: initialIds,
        simStatus: 'idle',
        simHistory: []
      };
    }

    case 'LOAD_PRESET': {
      const preset = action.payload;
      const initialIds = preset.states.filter(s => s.isInitial).map(s => s.id);
      return {
        ...state,
        mode: preset.mode,
        states: preset.states,
        inputs: preset.inputs,
        transitions: preset.transitions,
        stateCounter: preset.stateCounter,
        simString: preset.sampleString || '',
        simStep: -1,
        simActiveStates: initialIds,
        simStatus: 'idle',
        simHistory: [],
        currentView: 'visualizer'
      };
    }

    case 'RESET_AUTOMATON': {
      return {
        ...state,
        states: [],
        transitions: {},
        inputs: ['0', '1'],
        stateCounter: 0,
        simString: '',
        simStep: -1,
        simActiveStates: [],
        simStatus: 'idle',
        simHistory: []
      };
    }

    case 'ADD_STATE': {
      const newId = `q${state.stateCounter}`;
      const isFirst = state.states.length === 0;
      const newState = {
        id: newId,
        name: newId,
        x: 120 + ((state.states.length * 90) % 500),
        y: 180 + Math.floor(state.states.length / 5) * 80,
        isInitial: isFirst,
        isFinal: false
      };
      
      const newTransitions = { ...state.transitions };
      newTransitions[newId] = {};
      state.inputs.forEach(inp => {
        newTransitions[newId][inp] = [];
      });

      return {
        ...state,
        states: [...state.states, newState],
        transitions: newTransitions,
        stateCounter: state.stateCounter + 1
      };
    }

    case 'REMOVE_STATE': {
      const { id } = action.payload;
      const newStates = state.states.filter(s => s.id !== id);
      
      const newTransitions = { ...state.transitions };
      delete newTransitions[id];
      Object.keys(newTransitions).forEach(stateId => {
        Object.keys(newTransitions[stateId]).forEach(inp => {
          newTransitions[stateId][inp] = newTransitions[stateId][inp].filter(t => t !== id);
        });
      });

      const updatedActive = state.simActiveStates.filter(sId => sId !== id);
      const isAccepted = checkAcceptance(updatedActive, newStates);

      return {
        ...state,
        states: newStates,
        transitions: newTransitions,
        simActiveStates: updatedActive,
        simStatus: (state.simStatus === 'accepted' || state.simStatus === 'rejected')
          ? (isAccepted ? 'accepted' : 'rejected')
          : state.simStatus
      };
    }

    case 'UPDATE_STATE_NAME': {
      const { id, name } = action.payload;
      return {
        ...state,
        states: state.states.map(s => s.id === id ? { ...s, name } : s)
      };
    }

    case 'ADD_INPUT': {
      const { inputSymbol } = action.payload;
      if (!inputSymbol || state.inputs.includes(inputSymbol)) return state;
      
      const newInputs = [...state.inputs, inputSymbol];
      const newTransitions = { ...state.transitions };
      state.states.forEach(s => {
        if (!newTransitions[s.id]) newTransitions[s.id] = {};
        newTransitions[s.id][inputSymbol] = [];
      });

      return { ...state, inputs: newInputs, transitions: newTransitions };
    }

    case 'REMOVE_INPUT': {
      const { inputSymbol } = action.payload;
      const newInputs = state.inputs.filter(i => i !== inputSymbol);
      const newTransitions = { ...state.transitions };
      
      state.states.forEach(s => {
        if (newTransitions[s.id]) {
          delete newTransitions[s.id][inputSymbol];
        }
      });

      return { ...state, inputs: newInputs, transitions: newTransitions };
    }

    case 'SET_TRANSITION': {
      const { fromId, input, toIds } = action.payload;
      return {
        ...state,
        transitions: {
          ...state.transitions,
          [fromId]: {
            ...state.transitions[fromId],
            [input]: toIds
          }
        }
      };
    }

    case 'ADD_TRANSITION_TARGET': {
      const { fromId, input, targetId } = action.payload;
      const currentList = state.transitions[fromId]?.[input] || [];
      if (currentList.includes(targetId)) return state;

      return {
        ...state,
        transitions: {
          ...state.transitions,
          [fromId]: {
            ...state.transitions[fromId],
            [input]: [...currentList, targetId]
          }
        }
      };
    }

    case 'REMOVE_TRANSITION_TARGET': {
      const { fromId, input, targetId } = action.payload;
      const currentList = state.transitions[fromId]?.[input] || [];
      return {
        ...state,
        transitions: {
          ...state.transitions,
          [fromId]: {
            ...state.transitions[fromId],
            [input]: currentList.filter(t => t !== targetId)
          }
        }
      };
    }

    case 'SET_INITIAL_STATE': {
      const { id } = action.payload;
      const newStates = state.states.map(s => ({
        ...s,
        isInitial: s.id === id
      }));

      // If simulation is at start or reset, update active states
      const newActive = (state.simStep <= 0) ? [id] : state.simActiveStates;
      let newStatus = state.simStatus;

      if (state.simStep === 0 && state.simString.length === 0) {
        newStatus = checkAcceptance(newActive, newStates) ? 'accepted' : 'rejected';
      } else if (state.simStep === state.simString.length && state.simStep > 0) {
        newStatus = checkAcceptance(newActive, newStates) ? 'accepted' : 'rejected';
      }

      return {
        ...state,
        states: newStates,
        simActiveStates: newActive,
        simStatus: newStatus
      };
    }

    case 'TOGGLE_FINAL_STATE': {
      const { id } = action.payload;
      const newStates = state.states.map(s => ({
        ...s,
        isFinal: s.id === id ? !s.isFinal : s.isFinal
      }));

      // Appropriately update simulation status if simulation is finished or active!
      let newStatus = state.simStatus;
      if (state.simStatus === 'accepted' || state.simStatus === 'rejected' || (state.simStep >= 0 && state.simStep === state.simString.length)) {
        newStatus = checkAcceptance(state.simActiveStates, newStates) ? 'accepted' : 'rejected';
      }

      return {
        ...state,
        states: newStates,
        simStatus: newStatus
      };
    }

    case 'MOVE_STATE': {
      const { id, x, y } = action.payload;
      return {
        ...state,
        states: state.states.map(s => s.id === id ? { ...s, x, y } : s)
      };
    }

    case 'AUTO_REARRANGE': {
      const { states, transitions } = state;
      if (!states || states.length === 0) return state;

      const initialNode = states.find(s => s.isInitial) || states[0];
      
      const layers = {};
      const visited = new Set();
      const queue = [{ id: initialNode.id, depth: 0 }];
      visited.add(initialNode.id);
      layers[initialNode.id] = 0;

      while (queue.length > 0) {
        const { id, depth } = queue.shift();
        const nextIds = [];
        if (transitions[id]) {
          Object.values(transitions[id]).forEach(targets => {
            targets.forEach(t => {
              if (!visited.has(t)) {
                visited.add(t);
                nextIds.push(t);
              }
            });
          });
        }
        nextIds.forEach(t => {
          layers[t] = depth + 1;
          queue.push({ id: t, depth: depth + 1 });
        });
      }

      const maxDepth = Math.max(0, ...Object.values(layers));
      states.forEach(s => {
        if (layers[s.id] === undefined) {
          layers[s.id] = maxDepth + 1;
        }
      });

      const layerGroups = {};
      states.forEach(s => {
        const d = layers[s.id];
        if (!layerGroups[d]) layerGroups[d] = [];
        layerGroups[d].push(s);
      });

      const distinctLayers = Object.keys(layerGroups).map(Number).sort((a, b) => a - b);
      const totalLayers = distinctLayers.length;
      
      const startX = 140;
      const layerSpacing = totalLayers > 1 ? Math.min(220, Math.max(160, 520 / (totalLayers - 1))) : 200;
      const centerY = 240;

      // Check if all layers have 1 node (strictly sequential chain)
      const isLinearChain = totalLayers >= 3 && distinctLayers.every(d => layerGroups[d].length === 1);

      const newStates = states.map(s => {
        const d = layers[s.id];
        const group = layerGroups[d];
        const indexInGroup = group.findIndex(item => item.id === s.id);
        const countInGroup = group.length;

        const x = startX + d * layerSpacing;
        let y = centerY;

        if (countInGroup > 1) {
          // Multi-node layer: vertically centered around centerY
          const verticalSpacing = 130;
          const totalHeight = (countInGroup - 1) * verticalSpacing;
          y = centerY - totalHeight / 2 + indexInGroup * verticalSpacing;
        } else if (isLinearChain) {
          // Strictly sequential chain: arch middle nodes so back-transitions never pass through intermediate nodes
          const archHeight = 100;
          const angle = (d / (totalLayers - 1)) * Math.PI;
          y = centerY + 20 - Math.sin(angle) * archHeight;
        }

        return {
          ...s,
          x: Math.round(x),
          y: Math.round(y)
        };
      });

      return {
        ...state,
        states: newStates
      };
    }

    // --- SIMULATION ACTIONS ---
    case 'SET_SIM_STRING': {
      const str = action.payload;
      const initialIds = state.states.filter(s => s.isInitial).map(s => s.id);
      return {
        ...state,
        simString: str,
        simStep: -1,
        simActiveStates: initialIds,
        simStatus: 'idle',
        simHistory: []
      };
    }

    case 'SIM_RESET': {
      const initialIds = state.states.filter(s => s.isInitial).map(s => s.id);
      return {
        ...state,
        simStep: 0,
        simActiveStates: initialIds,
        simStatus: state.simString.length === 0 
          ? (checkAcceptance(initialIds, state.states) ? 'accepted' : 'rejected')
          : 'in_progress',
        simHistory: []
      };
    }

    case 'SIM_STEP_FORWARD': {
      const initialIds = state.states.filter(s => s.isInitial).map(s => s.id);
      
      // If idle, start at step 0
      if (state.simStep < 0) {
        const atStart = initialIds;
        if (state.simString.length === 0) {
          const acc = checkAcceptance(atStart, state.states);
          return {
            ...state,
            simStep: 0,
            simActiveStates: atStart,
            simStatus: acc ? 'accepted' : 'rejected',
            simHistory: []
          };
        }
        return {
          ...state,
          simStep: 0,
          simActiveStates: atStart,
          simStatus: 'in_progress',
          simHistory: []
        };
      }

      // If already at end of string
      if (state.simStep >= state.simString.length) {
        return state;
      }

      const symbol = state.simString[state.simStep];
      const nextStates = computeNextStates(state.simActiveStates, symbol, state.transitions);
      const nextStep = state.simStep + 1;
      const isFinished = nextStep >= state.simString.length;

      let newStatus = 'in_progress';
      if (isFinished) {
        newStatus = checkAcceptance(nextStates, state.states) ? 'accepted' : 'rejected';
      } else if (nextStates.length === 0) {
        // Dead end early
        newStatus = 'rejected';
      }

      return {
        ...state,
        simStep: nextStep,
        simActiveStates: nextStates,
        simStatus: newStatus,
        simHistory: [
          ...state.simHistory,
          { step: state.simStep, states: state.simActiveStates }
        ]
      };
    }

    case 'SIM_STEP_BACKWARD': {
      if (state.simHistory.length === 0 || state.simStep <= 0) {
        return state;
      }

      const prev = state.simHistory[state.simHistory.length - 1];
      const newHistory = state.simHistory.slice(0, -1);

      return {
        ...state,
        simStep: prev.step,
        simActiveStates: prev.states,
        simStatus: 'in_progress',
        simHistory: newHistory
      };
    }

    case 'SIM_RUN_ALL': {
      let currentActive = state.states.filter(s => s.isInitial).map(s => s.id);
      const history = [];

      for (let i = 0; i < state.simString.length; i++) {
        history.push({ step: i, states: currentActive });
        const symbol = state.simString[i];
        currentActive = computeNextStates(currentActive, symbol, state.transitions);
        if (currentActive.length === 0 && i < state.simString.length - 1) {
          // Dead end before finish
          return {
            ...state,
            simStep: i + 1,
            simActiveStates: [],
            simStatus: 'rejected',
            simHistory: history
          };
        }
      }

      const isAccepted = checkAcceptance(currentActive, state.states);

      return {
        ...state,
        simStep: state.simString.length,
        simActiveStates: currentActive,
        simStatus: isAccepted ? 'accepted' : 'rejected',
        simHistory: history
      };
    }

    default:
      return state;
  }
}

export function AutomataProvider({ children }) {
  const [state, dispatch] = useReducer(automataReducer, initialState);
  return (
    <AutomataContext.Provider value={{ state, dispatch }}>
      {children}
    </AutomataContext.Provider>
  );
}

export function useAutomata() {
  return useContext(AutomataContext);
}
