import React, { useState } from 'react';
import TodoInput from '../TodoInput';
import TodoList from '../TodoList';
import ThemeSwitcher from '../ThemeSwitcher';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './App.module.scss';

const App: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { theme } = useTheme();
  
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const renderTitle = () => {
    const title = "todos";
    
    if (theme === 'dark') {
      return (
        <h1 className={styles.title}>
          {title.split('').map((letter, index) => (
            <span key={index} className={styles.titleLetter}>
              {letter}
            </span>
          ))}
        </h1>
      );
    }
    
    return <h1 className={styles.title}>todos</h1>;
  };

  return (
    <div className={styles.app}>
      <ThemeSwitcher />
      {renderTitle()}
      <div className={styles.todoContainer}>
        <TodoInput isExpanded={isExpanded} toggleExpanded={toggleExpanded} />
        <div className={`${styles.listContainer} ${isExpanded ? styles.expanded : ''}`}>
          <TodoList />
        </div>
      </div>
      <div className={styles.info}>
        <p>Double-click to edit a todo</p>
        <p>Created for MindBox</p>
      </div>
    </div>
  );
};

export default App; 