import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import todoReducer, { addTodo } from '../store/todoSlice';
import TodoList from '../components/TodoList';

describe('TodoList Component', () => {
  const createStore = () => {
    const store = configureStore({
      reducer: {
        todos: todoReducer
      }
    });
    return store;
  };

  test('renders with initial todos', () => {
    const store = createStore();
    
    render(
      <Provider store={store}>
        <TodoList />
      </Provider>
    );

    // Should have 2 items left (3 total - 1 completed)
    const countElement = screen.getByText(/2 items left/i);
    expect(countElement).toBeInTheDocument();
  });

  test('shows correct count when adding new todos', () => {
    const store = createStore();
    store.dispatch(addTodo('Test Todo 1'));
    store.dispatch(addTodo('Test Todo 2'));
    
    render(
      <Provider store={store}>
        <TodoList />
      </Provider>
    );

    // Should have 4 items left (3 initial + 2 new - 1 completed initial)
    const countElement = screen.getByText(/4 items left/i);
    expect(countElement).toBeInTheDocument();
  });

  test('renders filter buttons', () => {
    const store = createStore();
    
    render(
      <Provider store={store}>
        <TodoList />
      </Provider>
    );

    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  test('renders clear completed button', () => {
    const store = createStore();
    
    render(
      <Provider store={store}>
        <TodoList />
      </Provider>
    );

    const clearButton = screen.getByText(/clear completed/i);
    expect(clearButton).toBeInTheDocument();
  });
}); 