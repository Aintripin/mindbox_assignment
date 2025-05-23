import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { clearCompleted } from '../../store/todoSlice';
import TodoItem from '../TodoItem';
import styles from './TodoList.module.scss';

const TodoList: React.FC = () => {
  const todos = useSelector((state: RootState) => state.todos.todos);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const dispatch = useDispatch();

  // Filter todos but maintain their original order
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - activeTodosCount;

  return (
    <div className={styles.todoListContainer}>
      <div className={styles.todos}>
        {filteredTodos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </div>
      
      {todos.length > 0 && (
        <div className={styles.todoFooter}>
          <span className={styles.count}>{activeTodosCount} items left</span>
          
          <div className={styles.filterButtons}>
            <button
              onClick={() => setFilter('all')}
              className={`${styles.filterButton} ${filter === 'all' ? styles.active : ''}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`${styles.filterButton} ${filter === 'active' ? styles.active : ''}`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`${styles.filterButton} ${filter === 'completed' ? styles.active : ''}`}
            >
              Completed
            </button>
          </div>
          
          {completedCount > 0 && (
            <button 
              className={styles.clearCompleted}
              onClick={() => dispatch(clearCompleted())}
            >
              Clear completed
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TodoList; 