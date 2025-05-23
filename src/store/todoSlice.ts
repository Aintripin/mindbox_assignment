import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Todo } from '../types';

interface TodosState {
  todos: Todo[];
}

interface UpdateTodoPayload {
  id: string;
  text: string;
}

// Generate unique ID with timestamp + random component
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const initialState: TodosState = {
  todos: [
    { id: '3', text: 'Покрытие тестами', completed: false },
    { id: '2', text: 'Прекрасный код', completed: true },
    { id: '1', text: 'Тестовое задание', completed: false },
  ],
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      const newTodo: Todo = {
        id: generateId(),
        text: action.payload,
        completed: false,
      };
      state.todos.unshift(newTodo);
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
    },
    clearCompleted: (state) => {
      state.todos = state.todos.filter(todo => !todo.completed);
    },
    updateTodo: (state, action: PayloadAction<UpdateTodoPayload>) => {
      const { id, text } = action.payload;
      const todo = state.todos.find(todo => todo.id === id);
      if (todo && text.trim()) {
        todo.text = text;
      }
    },
  },
});

export const { addTodo, toggleTodo, removeTodo, clearCompleted, updateTodo } = todoSlice.actions;
export default todoSlice.reducer; 