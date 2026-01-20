import React, { useState } from 'react';
import KanbanBoard from './components/KanbanBoard';
import './App.css';

function App() {
  const [boardTemplate, setBoardTemplate] = useState('kanban');

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎯  Drag & Drop Board</h1>
        <div className="template-selector">
          <button 
            className={boardTemplate === 'kanban' ? 'active' : ''}
            onClick={() => setBoardTemplate('kanban')}
          >
            Kanban Board
          </button>
          <button 
            className={boardTemplate === 'priority' ? 'active' : ''}
            onClick={() => setBoardTemplate('priority')}
          >
            Priority Board
          </button>
          <button 
            className={boardTemplate === 'timeline' ? 'active' : ''}
            onClick={() => setBoardTemplate('timeline')}
          >
            Timeline
          </button>
        </div>
      </header>
      
      <main className="app-main">
        <KanbanBoard template={boardTemplate} />
      </main>
    </div>
  );
}

export default App;
