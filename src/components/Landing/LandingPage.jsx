import React from 'react';
import { useAutomata } from '../../context/AutomataContext';
import { DFA_PRESETS, NFA_PRESETS } from '../../utils/presets';
import { 
  ArrowRight, 
  Play, 
  Cpu, 
  GitBranch, 
  Check, 
  Layers
} from 'lucide-react';
import './LandingPage.css';

export default function LandingPage() {
  const { dispatch } = useAutomata();

  const handleLaunchExample = (preset) => {
    dispatch({ type: 'LOAD_PRESET', payload: preset });
    dispatch({ type: 'SET_VIEW', payload: 'visualizer' });
  };

  const handleOpenSimulator = (mode = 'DFA') => {
    dispatch({ type: 'SET_MODE', payload: mode });
    dispatch({ type: 'SET_VIEW', payload: 'visualizer' });
  };

  return (
    <div className="landing-page-wrapper">
      {/* View 1: Centered Full-Width Hero Section */}
      <section className="landing-hero-view">
        <div className="hero-content-container">
          <div className="hero-badge">
            <span>Theory of Computation</span>
          </div>
          <h1 className="hero-title">
            Finite Automata
          </h1>
          <p className="hero-subtitle">
            An elegant study and simulation tool for Deterministic (DFA) and Non-Deterministic (NFA) state machines. 
            Understand state transitions, test input strings, and visualize formal language acceptance.
          </p>

          <div className="hero-actions">
            <button 
              className="hero-btn primary"
              onClick={() => handleOpenSimulator('DFA')}
            >
              <span>Launch Visualizer</span>
              <ArrowRight size={16} />
            </button>
            <a href="#examples-section" className="hero-btn secondary">
              <span>Explore Examples</span>
            </a>
          </div>
        </div>
      </section>

      {/* View 2: The Two Core Concept Blocks */}
      <section className="landing-section">
        <div className="concept-grid">
          {/* DFA Block */}
          <div className="concept-card">
            <div className="concept-card-header">
              <div className="concept-icon"><Cpu size={16} /></div>
              <div>
                <h2>Deterministic Finite Automata</h2>
                <span className="concept-sub">DFA</span>
              </div>
            </div>

            <p className="concept-desc">
              In a DFA, each (state, symbol) pair has <strong>exactly one deterministic transition</strong> to a next state. 
              The computational path for any input string is completely unique and predictable.
            </p>

            <div className="formal-box">
              <div className="formal-title">Formal 5-Tuple Definition</div>
              <div className="formal-formula">M = (Q, Σ, δ, q₀, F)</div>
              <ul className="formal-list">
                <li><span>Q</span>: Finite set of states</li>
                <li><span>Σ</span>: Input alphabet</li>
                <li><span>δ: Q × Σ → Q</span>: Single next-state transition function</li>
                <li><span>q₀ ∈ Q</span>: Initial state</li>
                <li><span>F ⊆ Q</span>: Set of accepting states (double concentric circle)</li>
              </ul>
            </div>

            <div className="key-points-list">
              <div className="key-point-item">
                <Check size={14} className="point-check" />
                <span>Deterministic: No ambiguity or backtracking</span>
              </div>
              <div className="key-point-item">
                <Check size={14} className="point-check" />
                <span>O(n) linear execution time for string length n</span>
              </div>
              <div className="key-point-item">
                <Check size={14} className="point-check" />
                <span>Foundation for hardware sequential logic and lexers</span>
              </div>
            </div>
          </div>

          {/* NFA Block */}
          <div className="concept-card">
            <div className="concept-card-header">
              <div className="concept-icon"><GitBranch size={16} /></div>
              <div>
                <h2>Non-Deterministic Finite Automata</h2>
                <span className="concept-sub">NFA</span>
              </div>
            </div>

            <p className="concept-desc">
              An NFA allows a state to transition to <strong>zero, one, or multiple states</strong> on a single input symbol. 
              Execution can be conceptualized as exploring multiple branches concurrently.
            </p>

            <div className="formal-box">
              <div className="formal-title">Formal 5-Tuple Definition</div>
              <div className="formal-formula">M = (Q, Σ, δ, q₀, F)</div>
              <ul className="formal-list">
                <li><span>Q</span>: Finite set of states</li>
                <li><span>Σ</span>: Input alphabet</li>
                <li><span>δ: Q × Σ → 𝒫(Q)</span>: Power set transition function (subsets of Q)</li>
                <li><span>q₀ ∈ Q</span>: Initial state</li>
                <li><span>F ⊆ Q</span>: Set of accepting states</li>
              </ul>
            </div>

            <div className="key-points-list">
              <div className="key-point-item">
                <Check size={14} className="point-check" />
                <span>Parallel branching: Tracks set of active states</span>
              </div>
              <div className="key-point-item">
                <Check size={14} className="point-check" />
                <span>Accepted if at least one branch terminates in F</span>
              </div>
              <div className="key-point-item">
                <Check size={14} className="point-check" />
                <span>Equally expressive to DFA (via Subset Construction)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* View 3: Comparison Table */}
      <section className="landing-section">
        <div className="section-title-wrap">
          <Layers size={16} className="section-icon" />
          <h2>Comparison Matrix</h2>
        </div>

        <div className="comparison-table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>DFA</th>
                <th>NFA</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Next State</strong></td>
                <td>Exactly one state per symbol</td>
                <td>Subset of states (0, 1, or multiple)</td>
              </tr>
              <tr>
                <td><strong>Transition Function</strong></td>
                <td><code>δ: Q × Σ → Q</code></td>
                <td><code>δ: Q × Σ → 𝒫(Q)</code></td>
              </tr>
              <tr>
                <td><strong>Path Predictability</strong></td>
                <td>Unique and direct</td>
                <td>Multiple concurrent computational branches</td>
              </tr>
              <tr>
                <td><strong>Acceptance Rule</strong></td>
                <td>End state is in F</td>
                <td>At least one active state is in F</td>
              </tr>
              <tr>
                <td><strong>Design Simplicity</strong></td>
                <td>Can require up to 2ⁿ states</td>
                <td>Often much more concise and intuitive to design</td>
              </tr>
              <tr>
                <td><strong>Equivalence</strong></td>
                <td colSpan="2" className="equivalence-cell">
                  Every NFA can be converted to an equivalent DFA via the Powerset / Subset Construction algorithm.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 4: Pre-built Automata Examples (Two Sides: Left = DFA stacked, Right = NFA stacked) */}
      <section id="examples-section" className="landing-section">
        <div className="section-title-wrap">
          <h2>Pre-built Automata Examples</h2>
          <span className="section-note">Explore classical formal language recognizers with pre-configured transitions</span>
        </div>

        <div className="examples-two-columns">
          {/* Left Column: DFA */}
          <div className="example-column">
            <div className="column-header">
              <span className="column-badge dfa">Deterministic (DFA)</span>
              <span className="column-count">2 Pre-built Models</span>
            </div>

            <div className="column-cards-stack">
              {DFA_PRESETS.map((preset, idx) => (
                <div key={preset.id} className="example-block-card">
                  <div className="card-inner-top">
                    <div className="card-header-line">
                      <span className="example-type-badge dfa">DFA</span>
                      <span className="example-num-tag">Ex {idx + 1}</span>
                    </div>
                    <h4 className="example-card-heading">{preset.title}</h4>
                    <p className="example-card-desc">{preset.description}</p>
                  </div>

                  <div className="card-inner-bottom">
                    <div className="example-metadata-chips">
                      <span>{preset.states.length} states</span>
                      <span>Σ = {'{'}{preset.inputs.join(', ')}{'}'}</span>
                      <span>Sample: "{preset.sampleString}"</span>
                    </div>

                    <div className="card-action-bar">
                      <button 
                        type="button"
                        className="btn-green-load"
                        onClick={() => handleLaunchExample(preset)}
                        title={`Load ${preset.title} into simulator`}
                      >
                        Load
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: NFA */}
          <div className="example-column">
            <div className="column-header">
              <span className="column-badge nfa">Non-Deterministic (NFA)</span>
              <span className="column-count">2 Pre-built Models</span>
            </div>

            <div className="column-cards-stack">
              {NFA_PRESETS.map((preset, idx) => (
                <div key={preset.id} className="example-block-card">
                  <div className="card-inner-top">
                    <div className="card-header-line">
                      <span className="example-type-badge nfa">NFA</span>
                      <span className="example-num-tag">Ex {idx + 1}</span>
                    </div>
                    <h4 className="example-card-heading">{preset.title}</h4>
                    <p className="example-card-desc">{preset.description}</p>
                  </div>

                  <div className="card-inner-bottom">
                    <div className="example-metadata-chips">
                      <span>{preset.states.length} states</span>
                      <span>Σ = {'{'}{preset.inputs.join(', ')}{'}'}</span>
                      <span>Sample: "{preset.sampleString}"</span>
                    </div>

                    <div className="card-action-bar">
                      <button 
                        type="button"
                        className="btn-green-load"
                        onClick={() => handleLaunchExample(preset)}
                        title={`Load ${preset.title} into simulator`}
                      >
                        Load
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Minimal Footer CTA */}
      <section className="landing-cta-section">
        <div className="cta-box">
          <h3>Ready to design custom state machines?</h3>
          <p>Create nodes, configure transitions, and test strings with real-time tape execution.</p>
          <button 
            className="hero-btn primary"
            onClick={() => handleOpenSimulator('DFA')}
          >
            <Play size={15} />
            <span>Open Simulator</span>
          </button>
        </div>
      </section>
    </div>
  );
}
