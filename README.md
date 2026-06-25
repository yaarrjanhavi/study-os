# 🌿 StudyOS — A Peaceful Digital Desk for Your Mind

StudyOS is a calming, distraction-free, and AI-enhanced digital study desk. Designed to eliminate the clutter of opening dozens of tabs, it unifies your lecture videos, notes, tasks, flashcards, and timers into a single, cohesive paper-like workspace.

---

## 🎨 Design Philosophy & Aesthetics

* **Zen Warm-Pastel Palette**: Styled using soft, tailored colors (`#F7F5F1` Shell, `#E0DCD1` Stone, `#D5E3E8` Sky, `#E4E3BC` Honeydew, `#344945` Viridian) optimized for both light and dark modes to prevent eye strain.
* **Glassmorphic Layouts**: Semi-transparent card layers with soft border highlights and smooth backdrops.
* **Calming Micro-Animations**: Interactive, CSS-animated desktop components—including a desk sprout plant companion that blossoms when you click to nurture it.

---

## 🚀 Key Features

### 📝 AI-Powered Markdown Notes
* Distraction-free rich markdown notes organizer.
* Highlight text directly in the editor to trigger **instant AI definitions, simplifications, or explanations**.
* Instantly export notes directly to your spaced-repetition flashcards deck.

### 🎥 Distraction-Free YouTube Player
* Embedded lecture viewer stripped of ads, recommendations, and comment sections.
* **Landmarks & Note Syncing**: Take notes alongside the video, save custom clickable timestamp bookmarks, and jump to them instantly.
* **Interactive Transcript**: Scroll and click phrases in the transcript to seek the video to that exact second.

### 📚 PDF Study Hub
* Interactive drag-and-drop PDF workspace.
* AI-driven chapter index compilation, document digests, and formula extractor panels.
* Integrated Q&A desk to query your documents directly.

### 🧠 Spaced-Repetition Flashcards
* Interactive review decks featuring smooth **3D card flipping animations**.
* Rate card difficulty to auto-schedule reviews.

### ⏱️ Calming Circular Pomodoro Timer
* Beautiful circular SVG clock visualizing remaining focus time.
* Ambient background sounds (rain/focus tracks) and audio notification chimes when milestones are reached.
* "Clean Focus Mode" to hide the entire dashboard and leave only the timer visible.

### 📅 Exam Planner & Portion Coverer
* Calendar-based exam planner mapping your upcoming test schedule.
* **AI Portion Assistant**: Input the chapters/syllabus you need to cover and the planner will automatically generate a day-by-day study schedule and import daily items straight to your Todo checklist.

### 📊 Smart Todo Boards & Analytics
* Three-column Kanban task board (To Do, In Progress, Done) with subtask checklists.
* Recharts focus-hour charts and subject progress distributions.
* Consistent focus tracking with streak flames and unlockable milestone badges.

### 🕸️ Interactive Knowledge Graph
* Draggable, interactive SVG graph network showing how your notes, lecture videos, and tasks connect.

---

## 🛠️ Technology Stack

* **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
* **Library**: [React 19](https://react.dev/)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **Animations**: [Framer Motion](https://www.framer.com/motion/)
* **Charts**: [Recharts](https://recharts.org/)
* **AI Engine**: Google Gemini API (via serverless endpoints with local client API key config)

---

## 📦 Getting Started

### 1. Install Dependencies
Clone the repository and run:
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser to view your desk.

### 3. Setup AI Features (Optional)
1. Go to the **Settings** tab in the sidebar.
2. Obtain a free API key from **Google AI Studio**.
3. Paste it into the API key field. (Keys are stored completely client-side in your local browser storage for safety).

---

## 🔮 Upcoming Features

* 📱 **Accessing Dashboard through Other Devices**: Synchronize your study desk state across mobile, tablet, and desktop devices on the same local network for on-the-go reading.
* ☁️ **Cloud Database Sync**: Optional end-to-end encrypted backup support.
* 🎧 **Lofi Audio Player Integration**: Direct ambient lofi audio feeds inside the Focus panel.
