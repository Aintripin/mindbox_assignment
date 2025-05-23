import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import '@testing-library/jest-dom';
import todoSlice from '../store/todoSlice';
import TodoInput from '../components/TodoInput';
import { ThemeProvider } from '../contexts/ThemeContext';

// Mock localStorage for tests
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('TodoInput Component', () => {
  const store = configureStore({
    reducer: {
      todos: todoSlice
    }
  });

  const renderTodoInput = (isExpanded = true) => {
    const mockToggle = jest.fn();
    return render(
      <Provider store={store}>
        <ThemeProvider>
          <TodoInput isExpanded={isExpanded} toggleExpanded={mockToggle} />
        </ThemeProvider>
      </Provider>
    );
  };

  test('renders input field', () => {
    renderTodoInput();
    const inputElement = screen.getByPlaceholderText(/what needs to be done/i);
    expect(inputElement).toBeInTheDocument();
  });

  test('can type in input field', async () => {
    const user = userEvent.setup();
    renderTodoInput();
    const inputElement = screen.getByPlaceholderText(/what needs to be done/i);
    
    await user.type(inputElement, 'New Todo');
    expect(inputElement).toHaveValue('New Todo');
  });

  test('clears input field after submitting with Enter', async () => {
    const user = userEvent.setup();
    renderTodoInput();
    const inputElement = screen.getByPlaceholderText(/what needs to be done/i);

    await user.type(inputElement, 'New Todo');
    await user.keyboard('{Enter}');

    expect(inputElement).toHaveValue('');
  });

  test('renders expand/collapse arrow', () => {
    renderTodoInput();
    const arrowElement = screen.getByLabelText(/collapse todo list/i);
    expect(arrowElement).toBeInTheDocument();
  });

  test('renders expand arrow when collapsed', () => {
    renderTodoInput(false);
    const arrowElement = screen.getByLabelText(/expand todo list/i);
    expect(arrowElement).toBeInTheDocument();
  });
}); 