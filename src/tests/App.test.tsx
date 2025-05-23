import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import todoReducer from '../store/todoSlice';
import App from '../components/App';
import { ThemeProvider } from '../contexts/ThemeContext';

// Mock localStorage for tests
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });
Object.defineProperty(document.body, 'className', { 
  value: '', 
  writable: true 
});

describe('App Component', () => {
  const store = configureStore({
    reducer: {
      todos: todoReducer
    }
  });

  test('renders todo app', () => {
    render(
      <Provider store={store}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </Provider>
    );

    const titleElement = screen.getByText(/todos/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders theme switcher button', () => {
    render(
      <Provider store={store}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </Provider>
    );

    const themeSwitcher = screen.getByLabelText(/switch to dark theme/i);
    expect(themeSwitcher).toBeInTheDocument();
  });
}); 