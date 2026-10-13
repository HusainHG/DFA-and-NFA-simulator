# AutomataStudio — Theory of Computation (DFA & NFA Visualizer)

An interactive, web-based simulation and visualization environment for studying **Deterministic Finite Automata (DFA)** and **Non-Deterministic Finite Automata (NFA)**. Built with React, Vite, and modern web standards, AutomataStudio allows students, educators, and engineers to construct state machines, inspect transition tables, step through string simulations in real time, and explore formal language theory.

---

## 🌟 Key Features

### 1. Interactive Graph Canvas
- **Visual State Nodes**: Render states as crisp circles with clean labels ($q_0, q_1, \dots$).
- **Formal State Indicators**:
  - Initial state indicated with an incoming horizontal start arrow (`START →`).
  - Accepting/Final states indicated by formal concentric double circles.
- **Drag & Drop**: Reposition any node across the grid with real-time vector edge recalculation.
- **Quick State Toggles**:
  - **Double-click** any state to instantly toggle its Final/Accepting state status.
  - **Right-click** any state on the canvas to open the context menu.
- **Collision-Avoidant Auto Rearrange**:
  - Uses a topological layered graph layout algorithm that arches middle nodes and curves long/backward transitions.
  - Ensures nodes and transition arrows do not overlap intermediate states or cross each other.
- **Perpendicular Arrow Labels**: Transition symbols sit cleanly above directed arrows with SVG halo masking to eliminate line clipping.
- **Active State Animation**: Dotted rotating pulse ring appears strictly on active states during execution, and stays hidden when idle.

### 2. Dual Formal Automata Engine (DFA & NFA)
- **Deterministic Finite Automata (DFA)**:
  - Enforces that each pair $(q, a) \in Q \times \Sigma$ transitions to exactly one next state.
  - O(n) deterministic simulation path.
- **Non-Deterministic Finite Automata (NFA)**:
  - Supports branching to zero, one, or multiple target states on any input symbol ($Q \times \Sigma \to \mathcal{P}(Q)$).
  - Tracks concurrent active state subsets $\mathcal{S} \subseteq Q$ simultaneously.
  - Accepts a string if at least one computation branch terminates in an accepting state ($F \cap \mathcal{S} \neq \emptyset$).
- **Curved Custom Dropdown**: Fully customized, smoothly curved dropdown selector (`border-radius: 12px` and `8px` hover radius) for switching between DFA and NFA modes without native OS select styling.

### 3. Dynamic Transition Table Editor
- **Direct Column Alphabets**: Column headers directly display alphabet symbols (e.g., `0`, `1`).
- **Dynamic Symbol Addition**: Click the `+` button on the right edge of the table to add new input symbols inline.
- **Symbol Removal**: Delete individual symbols from the alphabet with the trash button on column headers.
- **Hover 3-Dots State Actions**: Hovering over any state reveals a 3-dots menu with:
  - **Mark as Initial State** (ensures single unique start state).
  - **Mark as Final State** (toggles acceptance condition).
  - **Delete State** (cascades transition removals).
- **Multi-Target NFA Cells**: In NFA mode, cells display target state chips with quick remove (`×`) and a hover `+` button to add multiple targets.

### 4. Step-by-Step Simulation Tape
- **Interactive Input Tape**: Displays string symbols as discrete tape cells highlighting consumed symbols vs. the current active head.
- **Simulation Controls**:
  - **Test String**: Live input field to test arbitrary alphabet strings.
  - **Step Forward (`Step`)**: Advances execution by one symbol.
  - **Step Backward (`Back`)**: Reverts execution to the previous computational state.
  - **Auto-Play (`Play / Pause`)**: Steps through the input string automatically with interval pacing.
  - **Reset Tape (`Reset Tape`)**: Rewinds the tape head back to the initial state without changing machine configuration.
- **Verdict Indicators**: Real-time status badge indicates whether the current configuration is `Ready`, `Accepted`, or `Rejected`.

### 5. Theory of Computation Portal
- **Spacious First-View Hero**: Generous whitespace with direct links to launch the visualizer or explore examples.
- **Mathematical 5-Tuple Foundations**: Formal mathematical specifications for both DFA and NFA:
  $$M = (Q, \Sigma, \delta, q_0, F)$$
- **Comparison Matrix**: Side-by-side property analysis (Transition determinism, branching, Powerset construction equivalence).
- **Two-Column Stacked Example Showcase**:
  - **DFA Column (Left)**: Pre-built models for *Ends with "01"* and *Contains "101"*.
  - **NFA Column (Right)**: Pre-built models for *Ends with "01"* and *Contains "00" or "11"*.
  - Each with equal dimensions, metadata chips, and a simple green **Load** button.

### 6. Clean Slate Reset
- **Reset Automaton**: Located in the sidebar footer, clicking this completely clears all states, transitions, and test strings to a clean blank canvas.

---

## 📐 Formal Mathematical Framework

AutomataStudio adheres to the formal definitions established in Hopcroft, Motwani & Ullman's *Introduction to Automata Theory, Languages, and Computation*:

| Component | Formal Symbol | Description |
| :--- | :---: | :--- |
| **States** | $Q$ | A finite, non-empty set of internal states. |
| **Alphabet** | $\Sigma$ | A finite, non-empty set of input symbols. |
| **Transition Function** | $\delta$ | For DFA: $\delta: Q \times \Sigma \to Q$<br>For NFA: $\delta: Q \times \Sigma \to \mathcal{P}(Q)$ |
| **Initial State** | $q_0$ | The unique start state where $q_0 \in Q$. |
| **Accepting States** | $F$ | A subset of states where $F \subseteq Q$. |

---

## 🛠️ Tech Stack & Architecture

- **UI Library**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Vanilla CSS with customized Gray & White design tokens
- **Linter**: [Oxlint](https://oxc.rs/)

### Project File Structure

```text
TOC/
├── index.html                   # HTML entry point
├── package.json                 # Project dependencies and scripts
├── vite.config.js               # Vite build configuration
├── src/
│   ├── main.jsx                 # React root mount
│   ├── App.jsx                  # Main application orchestrator & tab router
│   ├── App.css                  # Global layout containers
│   ├── index.css                # Color tokens, fonts, and reset styles
│   ├── context/
│   │   └── AutomataContext.jsx  # Reducer, simulation engine, and graph layout
│   ├── utils/
│   │   └── presets.js           # Pre-built classical DFA and NFA configurations
│   └── components/
│       ├── Navigation/
│       │   ├── Navbar.jsx       # Header bar with centered tabs & brand logo
│       │   └── Navbar.css
│       ├── Landing/
│       │   ├── LandingPage.jsx  # Theory portal, 5-tuples, comparison & examples
│       │   └── LandingPage.css
│       ├── Canvas/
│       │   ├── Canvas.jsx       # SVG graph surface, collision routing & toolbar
│       │   ├── Canvas.css
│       │   ├── StateNode.jsx    # SVG state circle, initial arrow & double final rings
│       │   └── TransitionEdge.jsx # Quadratic bezier curves, offsets & text halo
│       ├── Panel/
│       │   ├── TransitionPanel.jsx # Sidebar, custom curved dropdown & footer
│       │   ├── TransitionPanel.css
│       │   ├── TransitionTable.jsx # Transition matrix, add column & 3-dots menus
│       │   └── TransitionTable.css
│       ├── Simulation/
│       │   ├── SimulationBar.jsx   # Tape player, step forward/back & status badges
│       │   └── SimulationBar.css
│       └── ContextMenu/
│           ├── ContextMenu.jsx  # Canvas right-click options menu
│           └── ContextMenu.css
```

---

## 🚀 Getting Started & Setup

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (version 18 or higher recommended).

### 1. Installation
Clone or navigate to the repository directory and install dependencies:

```bash
cd TOC
npm install
```

### 2. Running in Development
Start the local Vite development server:

```bash
npm run dev
```

The application will be live at `http://localhost:5173/` (or the port indicated in your terminal).

### 3. Production Build
To create a production-ready bundle in the `dist/` directory:

```bash
npm run build
```

To preview the built production bundle locally:

```bash
npm run preview
```

### 4. Linting
To check code quality and rules with Oxlint:

```bash
npm run lint
```

---

## 📖 Usage Guide

### Creating an Automaton from Scratch
1. Navigate to the **Visualizer** tab via the top navigation bar.
2. If an existing model is open, click **Reset Automaton** in the bottom-right sidebar to clear the canvas.
3. Select your model type (**DFA** or **NFA**) from the custom curved dropdown.
4. Click **+ Add State** in the table panel to create states ($q_0, q_1, \dots$). The first state created automatically becomes the initial state ($q_0$).
5. Define input symbols:
   - Click the `+` icon on the right edge of the table header to add symbols (e.g., `0`, `1`, `a`, `b`).
6. Configure transitions:
   - For **DFA**: Select the destination state from each dropdown cell.
   - For **NFA**: Click the cell's `+` icon to add destination states.
7. Mark accepting states:
   - Double-click any state on the canvas, or click its 3-dots icon in the table and choose **Final State**.
8. Click **Auto Rearrange** in the bottom-left canvas toolbar to balance and format state spacing.

### Simulating Strings
1. In the bottom simulation bar, enter an input string in the **Test String** box (e.g., `1001`).
2. Click **Step** to advance through each character one by one and observe the active state update on the canvas.
3. Alternatively, click **Play** to automatically animate the computation path.
4. Watch the result badge change to **Accepted** (green) or **Rejected** (red) upon completion.

---

## 📄 License

This project is licensed under the **Educational & Permissive Open License** — free to use, modify, learn from, distribute, and integrate for educational, research, personal, and commercial purposes, **except for any unlawful or illegal usage**.

See the full terms in the [LICENSE](file:///e:/TOC/LICENSE) file.
