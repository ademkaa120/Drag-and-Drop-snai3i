import React, { useState, useEffect, useRef } from 'react';
import Column from './Column';
import '../styles/KanbanBoard.css';

const KanbanBoard = ({ template }) => {
  const [board, setBoard] = useState(() => {
    const saved = localStorage.getItem('kanbanBoard');
    return saved ? JSON.parse(saved) : getDefaultBoard(template);
  });

  const [history, setHistory] = useState([board]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const draggedItem = useRef(null);

  useEffect(() => {
    localStorage.setItem('kanbanBoard', JSON.stringify(board));
  }, [board]);

  function getDefaultBoard(tmpl) {
    if (tmpl === 'kanban') {
      return {
        'todo': [
          { id: '1', title: 'Setup project', description: 'Initialize React project', priority: 'high', tags: ['setup', 'urgent'] },
          { id: '2', title: 'Design mockups', description: 'Create UI designs', priority: 'medium', tags: ['design'] }
        ],
        'in-progress': [
          { id: '3', title: 'Build components', description: 'Create React components', priority: 'high', tags: ['development'] },
          { id: '4', title: 'Add drag-drop', description: 'Implement draggable items', priority: 'high', tags: ['feature', 'development'] }
        ],
        'review': [
          { id: '5', title: 'Code review', description: 'Review PR changes', priority: 'medium', tags: ['review'] }
        ],
        'done': [
          { id: '6', title: 'Setup Git', description: 'Initialize repository', priority: 'high', tags: ['completed'] }
        ]
      };
    } else if (tmpl === 'priority') {
      return {
        'critical': [
          { id: '1', title: 'Fix production bug', description: 'Urgent bug fix needed', priority: 'critical', tags: ['bug', 'critical'] }
        ],
        'high': [
          { id: '2', title: 'New feature A', description: 'Feature implementation', priority: 'high', tags: ['feature'] }
        ],
        'medium': [
          { id: '3', title: 'Refactor code', description: 'Clean up code', priority: 'medium', tags: ['refactor'] }
        ],
        'low': [
          { id: '4', title: 'Documentation', description: 'Update docs', priority: 'low', tags: ['docs'] }
        ]
      };
    } else {
      return {
        'this-week': [
          { id: '1', title: 'Sprint planning', description: 'Plan sprint tasks', priority: 'high', tags: ['planning'] }
        ],
        'this-month': [
          { id: '2', title: 'Release v2.0', description: 'Major release', priority: 'high', tags: ['release'] }
        ],
        'q1': [
          { id: '3', title: 'Strategic goals', description: 'Quarterly objectives', priority: 'medium', tags: ['goals'] }
        ]
      };
    }
  }

  const addTask = (columnId, title, description = '', priority = 'medium') => {
    const newTask = {
      id: Date.now().toString(),
      title,
      description,
      priority,
      tags: []
    };
    
    updateBoard(prev => ({
      ...prev,
      [columnId]: [...(prev[columnId] || []), newTask]
    }));
  };

  const updateTask = (columnId, taskId, updates) => {
    updateBoard(prev => ({
      ...prev,
      [columnId]: prev[columnId].map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    }));
  };

  const deleteTask = (columnId, taskId) => {
    updateBoard(prev => ({
      ...prev,
      [columnId]: prev[columnId].filter(task => task.id !== taskId)
    }));
  };

  const moveTask = (fromColumn, toColumn, fromIndex, toIndex) => {
    updateBoard(prev => {
      const newBoard = { ...prev };
      const [movedTask] = newBoard[fromColumn].splice(fromIndex, 1);
      
      if (fromColumn === toColumn) {
        newBoard[toColumn].splice(toIndex, 0, movedTask);
      } else {
        newBoard[toColumn] = newBoard[toColumn] || [];
        newBoard[toColumn].splice(toIndex, 0, movedTask);
      }
      
      return newBoard;
    });
  };

  const updateBoard = (updater) => {
    const newBoard = typeof updater === 'function' ? updater(board) : updater;
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newBoard);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setBoard(newBoard);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setBoard(history[newIndex]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setBoard(history[newIndex]);
    }
  };

  const clearBoard = () => {
    if (window.confirm('Clear all tasks? This action cannot be undone.')) {
      updateBoard(getDefaultBoard(template));
    }
  };

  const resetTemplate = () => {
    updateBoard(getDefaultBoard(template));
  };

  return (
    <div className="kanban-board">
      <div className="board-controls">
        <button onClick={undo} disabled={historyIndex === 0} className="btn-undo">
          ↶ Undo
        </button>
        <button onClick={redo} disabled={historyIndex === history.length - 1} className="btn-redo">
          ↷ Redo
        </button>
        <button onClick={resetTemplate} className="btn-reset">
          🔄 Reset
        </button>
        <button onClick={clearBoard} className="btn-clear">
          🗑️ Clear All
        </button>
      </div>

      <div className="columns-container">
        {Object.entries(board).map(([columnId, tasks]) => (
          <Column
            key={columnId}
            columnId={columnId}
            tasks={tasks}
            onAddTask={addTask}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            onMoveTask={moveTask}
            draggedItem={draggedItem}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
