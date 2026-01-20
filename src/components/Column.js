import React, { useState } from 'react';
import TaskCard from './TaskCard';
import '../styles/Column.css';

const Column = ({
  columnId,
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onMoveTask,
  draggedItem
}) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      onAddTask(columnId, newTaskTitle);
      setNewTaskTitle('');
      setIsAddingTask(false);
    }
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('application/json'));
    onMoveTask(data.fromColumn, columnId, data.fromIndex, index);
    setDragOverIndex(null);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const formatColumnName = (id) => {
    return id
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getColumnIcon = (id) => {
    const icons = {
      'todo': '📋',
      'in-progress': '⚙️',
      'review': '👀',
      'done': '✅',
      'critical': '🚨',
      'high': '⬆️',
      'medium': '➡️',
      'low': '⬇️',
      'this-week': '📅',
      'this-month': '📆',
      'q1': '🎯'
    };
    return icons[id] || '📌';
  };

  return (
    <div className="column">
      <div className="column-header">
        <h2 className="column-title">
          {getColumnIcon(columnId)} {formatColumnName(columnId)}
        </h2>
        <span className="task-count">{tasks.length}</span>
      </div>

      <div
        className="tasks-list"
        onDragOver={(e) => handleDragOver(e, tasks.length)}
        onDrop={(e) => handleDrop(e, tasks.length)}
        onDragLeave={handleDragLeave}
      >
        {tasks.map((task, index) => (
          <div
            key={task.id}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            className={`task-wrapper ${dragOverIndex === index ? 'drag-over' : ''}`}
          >
            <TaskCard
              task={task}
              columnId={columnId}
              taskIndex={index}
              onUpdate={onUpdateTask}
              onDelete={onDeleteTask}
              onMove={onMoveTask}
              draggedItem={draggedItem}
            />
          </div>
        ))}

        {isAddingTask && (
          <div className="add-task-form">
            <input
              type="text"
              placeholder="Task title..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleAddTask();
                if (e.key === 'Escape') {
                  setIsAddingTask(false);
                  setNewTaskTitle('');
                }
              }}
              autoFocus
              className="task-input"
            />
            <div className="form-buttons">
              <button onClick={handleAddTask} className="btn-confirm">
                ✓ Add
              </button>
              <button
                onClick={() => {
                  setIsAddingTask(false);
                  setNewTaskTitle('');
                }}
                className="btn-cancel"
              >
                ✕ Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {!isAddingTask && (
        <button
          className="btn-add-task"
          onClick={() => setIsAddingTask(true)}
        >
          + Add Task
        </button>
      )}
    </div>
  );
};

export default Column;
