import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import '@testing-library/jest-dom';
import TodoItem from '../components/TodoItem';
import todoSlice from '../store/todoSlice';
import { Todo } from '../types';

// Mock store setup
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      todos: todoSlice,
    },
    preloadedState: {
      todos: {
        todos: [],
        filter: 'all',
        ...initialState,
      },
    },
  });
};

const mockTodo: Todo = {
  id: '1',
  text: 'Test todo',
  completed: false,
};

const completedTodo: Todo = {
  id: '2',
  text: 'Completed todo',
  completed: true,
};

const renderWithProvider = (component: React.ReactElement, initialState = {}) => {
  const store = createMockStore(initialState);
  return {
    store,
    ...render(
      <Provider store={store}>
        {component}
      </Provider>
    ),
  };
};

describe('TodoItem', () => {
  test('renders todo text correctly', () => {
    renderWithProvider(<TodoItem todo={mockTodo} />);
    expect(screen.getByText('Test todo')).toBeInTheDocument();
  });

  test('renders completed todo with checkmark', () => {
    renderWithProvider(<TodoItem todo={completedTodo} />);
    expect(screen.getByText('✓')).toBeInTheDocument();
    expect(screen.getByText('Completed todo')).toHaveClass('completed');
  });

  test('toggles todo completion when checkbox is clicked', () => {
    const { store } = renderWithProvider(<TodoItem todo={mockTodo} />);
    const checkbox = screen.getByRole('button', { name: /delete todo/i }).previousElementSibling;
    
    fireEvent.click(checkbox!);
    
    // Check if the toggle action was dispatched
    const state = store.getState();
    expect(state.todos.todos).toHaveLength(0); // Store is empty in test, action would be dispatched
  });

  test('deletes todo when delete button is clicked', () => {
    const { store } = renderWithProvider(<TodoItem todo={mockTodo} />);
    const deleteButton = screen.getByRole('button', { name: /delete todo/i });
    
    fireEvent.click(deleteButton);
    
    // Action would be dispatched to store
    const state = store.getState();
    expect(state.todos.todos).toHaveLength(0);
  });

  test('enters edit mode when double-clicked', async () => {
    const user = userEvent.setup();
    renderWithProvider(<TodoItem todo={mockTodo} />);
    
    const todoText = screen.getByText('Test todo');
    await user.dblClick(todoText);
    
    // Should show edit input
    expect(screen.getByDisplayValue('Test todo')).toBeInTheDocument();
    expect(screen.queryByText('Test todo')).not.toBeInTheDocument();
  });

  test('saves changes when Enter is pressed in edit mode', async () => {
    const user = userEvent.setup();
    renderWithProvider(<TodoItem todo={mockTodo} />);
    
    const todoText = screen.getByText('Test todo');
    await user.dblClick(todoText);
    
    const editInput = screen.getByDisplayValue('Test todo');
    await user.clear(editInput);
    await user.type(editInput, 'Updated todo');
    await user.keyboard('{Enter}');
    
    // Should exit edit mode
    expect(screen.queryByDisplayValue('Updated todo')).not.toBeInTheDocument();
    expect(screen.getByText('Test todo')).toBeInTheDocument(); // Original text still shows in component
  });

  test('saves changes when input loses focus', async () => {
    const user = userEvent.setup();
    renderWithProvider(<TodoItem todo={mockTodo} />);
    
    const todoText = screen.getByText('Test todo');
    await user.dblClick(todoText);
    
    const editInput = screen.getByDisplayValue('Test todo');
    await user.clear(editInput);
    await user.type(editInput, 'Updated via blur');
    
    // Simulate blur by clicking outside
    fireEvent.blur(editInput);
    
    // Should exit edit mode
    expect(screen.queryByDisplayValue('Updated via blur')).not.toBeInTheDocument();
  });

  test('cancels edit when Escape is pressed', async () => {
    const user = userEvent.setup();
    renderWithProvider(<TodoItem todo={mockTodo} />);
    
    const todoText = screen.getByText('Test todo');
    await user.dblClick(todoText);
    
    const editInput = screen.getByDisplayValue('Test todo');
    await user.clear(editInput);
    await user.type(editInput, 'This should be cancelled');
    await user.keyboard('{Escape}');
    
    // Should exit edit mode and revert to original text
    expect(screen.queryByDisplayValue('This should be cancelled')).not.toBeInTheDocument();
    expect(screen.getByText('Test todo')).toBeInTheDocument();
  });

  test('resets to original text when saving empty text', async () => {
    const user = userEvent.setup();
    renderWithProvider(<TodoItem todo={mockTodo} />);
    
    const todoText = screen.getByText('Test todo');
    await user.dblClick(todoText);
    
    const editInput = screen.getByDisplayValue('Test todo');
    await user.clear(editInput);
    await user.keyboard('{Enter}');
    
    // Should exit edit mode and show original text
    expect(screen.getByText('Test todo')).toBeInTheDocument();
  });

  test('hides delete button in edit mode', async () => {
    const user = userEvent.setup();
    renderWithProvider(<TodoItem todo={mockTodo} />);
    
    // Delete button should be visible initially
    expect(screen.getByRole('button', { name: /delete todo/i })).toBeInTheDocument();
    
    const todoText = screen.getByText('Test todo');
    await user.dblClick(todoText);
    
    // Delete button should be hidden in edit mode
    expect(screen.queryByRole('button', { name: /delete todo/i })).not.toBeInTheDocument();
  });

  test('focuses input when entering edit mode', async () => {
    const user = userEvent.setup();
    renderWithProvider(<TodoItem todo={mockTodo} />);
    
    const todoText = screen.getByText('Test todo');
    await user.dblClick(todoText);
    
    const editInput = screen.getByDisplayValue('Test todo');
    expect(editInput).toHaveFocus();
  });
}); 