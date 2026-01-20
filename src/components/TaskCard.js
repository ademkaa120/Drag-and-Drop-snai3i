import React, { useState } from 'react';
import '../styles/TaskCard.css';

const TaskCard = ({
  task,
  columnId,
  taskIndex,
  onUpdate,
  onDelete,
  onMove,
  draggedItem
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [showMenu, setShowMenu] = useState(false);

  const handleDragStart = (e) => {
    draggedItem.current = { columnId, taskIndex };
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({ fromColumn: columnId, fromIndex: taskIndex })
    );
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
  };

  const handleSaveEdit = () => {
    if (editTitle.trim()) {
      onUpdate(columnId, task.id, {
        title: editTitle,
        description: editDescription
      });
      setIsEditing(false);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      critical: '#ff4757',
      high: '#ff6348',
      medium: '#ffa502',
      low: '#2ed573'
    };
    return colors[priority] || '#95a5a6';
  };

  const getPriorityLabel = (priority) => {
    const labels = {
      critical: '🔴 Critical',
      high: '🟠 High',
      medium: '🟡 Medium',
      low: '🟢 Low'
    };
    return labels[priority] || priority;
  };

  if (isEditing) {
    return (
      <div className="task-card editing">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="edit-title"
          autoFocus
        />
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          className="edit-description"
          placeholder="Description..."
        />
        <div className="edit-buttons">
          <button onClick={handleSaveEdit} className="btn-save">
            ✓ Save
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              setEditTitle(task.title);
              setEditDescription(task.description || '');
            }}
            className="btn-cancel-edit"
          >
            ✕ Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="task-card"
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={{
        borderLeftColor: getPriorityColor(task.priority)
      }}
    >
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        <div className="task-menu">
          <button
            className="menu-btn"
            onClick={() => setShowMenu(!showMenu)}
          >
            ⋯
          </button>
          {showMenu && (
            <div className="dropdown-menu">
              <button onClick={() => {
                setIsEditing(true);
                setShowMenu(false);
              }}>
                ✎ Edit
              </button>
              <button onClick={() => {
                onDelete(columnId, task.id);
                setShowMenu(false);
              }}>
                🗑️ Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-footer">
        <span
          className="priority-badge"
          style={{ backgroundColor: getPriorityColor(task.priority) }}
        >
          {getPriorityLabel(task.priority)}
        </span>
        {task.tags && task.tags.length > 0 && (
          <div className="tags">
            {task.tags.map((tag) => (
              <span key={tag} className="tag">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
