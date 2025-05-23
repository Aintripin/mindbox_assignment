import React from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { ChevronDown } from 'lucide-react';
import { addTodo } from '../../store/todoSlice';
import styles from './TodoInput.module.scss';

interface TodoInputProps {
  isExpanded: boolean;
  toggleExpanded: () => void;
}

interface FormData {
  todoText: string;
}

const TodoInput: React.FC<TodoInputProps> = ({ isExpanded, toggleExpanded }) => {
  const dispatch = useDispatch();
  const { register, handleSubmit, reset } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    if (data.todoText.trim()) {
      dispatch(addTodo(data.todoText));
      reset();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <div className={styles.inputContainer}>
      <div className={styles.inputHeader}>
        <span 
          className={`${styles.arrow} ${isExpanded ? styles.expanded : ''}`}
          onClick={toggleExpanded}
          aria-label={isExpanded ? "Collapse todo list" : "Expand todo list"}
        >
          <ChevronDown size={20} strokeWidth={2} />
        </span>
        <input
          type="text"
          {...register('todoText', { 
            required: 'Todo text is required',
            minLength: { value: 1, message: 'Todo must not be empty' }
          })}
          placeholder="What needs to be done?"
          className={styles.inputField}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
};

export default TodoInput; 