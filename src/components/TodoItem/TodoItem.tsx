import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toggleTodo, removeTodo, updateTodo } from '../../store/todoSlice';
import { Todo } from '../../types';
import styles from './TodoItem.module.scss';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const dispatch = useDispatch();
  const editInputRef = useRef<HTMLInputElement>(null);

  const handleToggle = () => {
    dispatch(toggleTodo(todo.id));
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    if (editText.trim()) {
      dispatch(updateTodo({ id: todo.id, text: editText }));
    } else {
      setEditText(todo.text);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (editText.trim()) {
        dispatch(updateTodo({ id: todo.id, text: editText }));
      } else {
        setEditText(todo.text);
      }
      setIsEditing(false);
    } else if (e.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div className={styles.todoItem}>
      <div 
        className={`${styles.checkboxContainer} ${todo.completed ? styles.completed : ''}`}
        onClick={handleToggle}
      >
        {todo.completed && <span className={styles.checkmark}>✓</span>}
      </div>
      
      {isEditing ? (
        <input
          ref={editInputRef}
          type="text"
          className={styles.editInput}
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <span
          className={`${styles.todoText} ${todo.completed ? styles.completed : ''}`}
          onClick={handleToggle}
          onDoubleClick={handleDoubleClick}
        >
          {todo.text}
        </span>
      )}
      
      {!isEditing && (
        <button
          onClick={() => dispatch(removeTodo(todo.id))}
          className={styles.deleteButton}
          aria-label="Delete todo"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default TodoItem; 