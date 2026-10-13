export const DFA_PRESETS = [
  {
    id: 'dfa-ends-01',
    mode: 'DFA',
    title: 'Ends with "01"',
    shortTitle: 'Example 1: Ends with "01"',
    description: 'Accepts all binary strings ending with "01" (3 states).',
    sampleString: '1001',
    states: [
      { id: 'q0', name: 'q0', x: 140, y: 240, isInitial: true, isFinal: false },
      { id: 'q1', name: 'q1', x: 330, y: 150, isInitial: false, isFinal: false },
      { id: 'q2', name: 'q2', x: 520, y: 240, isInitial: false, isFinal: true }
    ],
    inputs: ['0', '1'],
    transitions: {
      'q0': { '0': ['q1'], '1': ['q0'] },
      'q1': { '0': ['q1'], '1': ['q2'] },
      'q2': { '0': ['q1'], '1': ['q0'] }
    },
    stateCounter: 3
  },
  {
    id: 'dfa-contains-101',
    mode: 'DFA',
    title: 'Contains "101"',
    shortTitle: 'Example 2: Contains "101"',
    description: 'Accepts binary strings containing substring "101" (4 states).',
    sampleString: '01010',
    states: [
      { id: 'q0', name: 'q0', x: 120, y: 240, isInitial: true, isFinal: false },
      { id: 'q1', name: 'q1', x: 280, y: 150, isInitial: false, isFinal: false },
      { id: 'q2', name: 'q2', x: 440, y: 150, isInitial: false, isFinal: false },
      { id: 'q3', name: 'q3', x: 600, y: 240, isInitial: false, isFinal: true }
    ],
    inputs: ['0', '1'],
    transitions: {
      'q0': { '0': ['q0'], '1': ['q1'] },
      'q1': { '0': ['q2'], '1': ['q1'] },
      'q2': { '0': ['q0'], '1': ['q3'] },
      'q3': { '0': ['q3'], '1': ['q3'] }
    },
    stateCounter: 4
  }
];

export const NFA_PRESETS = [
  {
    id: 'nfa-ends-01',
    mode: 'NFA',
    title: 'Ends with "01"',
    shortTitle: 'Example 1: Ends with "01"',
    description: 'Accepts strings ending with "01" using non-deterministic branching at q0 on 0 (3 states).',
    sampleString: '1101',
    states: [
      { id: 'q0', name: 'q0', x: 140, y: 240, isInitial: true, isFinal: false },
      { id: 'q1', name: 'q1', x: 340, y: 240, isInitial: false, isFinal: false },
      { id: 'q2', name: 'q2', x: 540, y: 240, isInitial: false, isFinal: true }
    ],
    inputs: ['0', '1'],
    transitions: {
      'q0': { '0': ['q0', 'q1'], '1': ['q0'] },
      'q1': { '0': [], '1': ['q2'] },
      'q2': { '0': [], '1': [] }
    },
    stateCounter: 3
  },
  {
    id: 'nfa-contains-00-or-11',
    mode: 'NFA',
    title: 'Contains "00" or "11"',
    shortTitle: 'Example 2: "00" or "11"',
    description: 'Non-deterministically checks for duplicate consecutive symbols "00" or "11" in parallel (4 states).',
    sampleString: '0100',
    states: [
      { id: 'q0', name: 'q0', x: 140, y: 240, isInitial: true, isFinal: false },
      { id: 'q1', name: 'q1', x: 340, y: 140, isInitial: false, isFinal: false },
      { id: 'q2', name: 'q2', x: 340, y: 340, isInitial: false, isFinal: false },
      { id: 'q3', name: 'q3', x: 550, y: 240, isInitial: false, isFinal: true }
    ],
    inputs: ['0', '1'],
    transitions: {
      'q0': { '0': ['q0', 'q1'], '1': ['q0', 'q2'] },
      'q1': { '0': ['q3'], '1': [] },
      'q2': { '0': [], '1': ['q3'] },
      'q3': { '0': ['q3'], '1': ['q3'] }
    },
    stateCounter: 4
  }
];
