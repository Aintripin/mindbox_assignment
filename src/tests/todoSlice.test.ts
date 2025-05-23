import todoReducer, { addTodo, toggleTodo, removeTodo, clearCompleted, updateTodo } from '../store/todoSlice';

describe('todo reducer', () => {
  const initialState = {
    todos: []
  };

  it('should handle initial state', () => {
    const actual = todoReducer(undefined, { type: 'unknown' });
    expect(actual.todos).toHaveLength(3);
    expect(actual.todos[0].text).toEqual('Покрытие тестами');
    expect(actual.todos[1].text).toEqual('Прекрасный код');
    expect(actual.todos[2].text).toEqual('Тестовое задание');
  });

  it('should handle adding a todo', () => {
    const actual = todoReducer(initialState, addTodo('Test Todo'));
    expect(actual.todos.length).toEqual(1);
    expect(actual.todos[0].text).toEqual('Test Todo');
    expect(actual.todos[0].completed).toEqual(false);
    expect(actual.todos[0].id).toBeDefined();
  });

  it('should handle toggling a todo', () => {
    const state = {
      todos: [
        { id: '1', text: 'Test Todo', completed: false }
      ]
    };
    const actual = todoReducer(state, toggleTodo('1'));
    expect(actual.todos[0].completed).toEqual(true);
  });

  it('should handle removing a todo', () => {
    const state = {
      todos: [
        { id: '1', text: 'Test Todo', completed: false }
      ]
    };
    const actual = todoReducer(state, removeTodo('1'));
    expect(actual.todos.length).toEqual(0);
  });

  it('should handle updating a todo', () => {
    const state = {
      todos: [
        { id: '1', text: 'Original Text', completed: false }
      ]
    };
    const actual = todoReducer(state, updateTodo({ id: '1', text: 'Updated Text' }));
    expect(actual.todos[0].text).toEqual('Updated Text');
    expect(actual.todos[0].completed).toEqual(false);
  });

  it('should handle updating a non-existent todo', () => {
    const state = {
      todos: [
        { id: '1', text: 'Original Text', completed: false }
      ]
    };
    const actual = todoReducer(state, updateTodo({ id: '999', text: 'Should not update' }));
    expect(actual.todos[0].text).toEqual('Original Text'); // Should remain unchanged
  });

  it('should handle updating todo with empty text', () => {
    const state = {
      todos: [
        { id: '1', text: 'Original Text', completed: false }
      ]
    };
    const actual = todoReducer(state, updateTodo({ id: '1', text: '   ' }));
    expect(actual.todos[0].text).toEqual('Original Text'); // Should not update with whitespace-only text
  });

  it('should handle clearing completed todos', () => {
    const state = {
      todos: [
        { id: '1', text: 'Completed Todo', completed: true },
        { id: '2', text: 'Active Todo', completed: false },
        { id: '3', text: 'Another Completed', completed: true }
      ]
    };
    const actual = todoReducer(state, clearCompleted());
    expect(actual.todos.length).toEqual(1);
    expect(actual.todos[0].text).toEqual('Active Todo');
    expect(actual.todos[0].completed).toEqual(false);
  });

  it('should handle clearing completed todos when none are completed', () => {
    const state = {
      todos: [
        { id: '1', text: 'Active Todo 1', completed: false },
        { id: '2', text: 'Active Todo 2', completed: false }
      ]
    };
    const actual = todoReducer(state, clearCompleted());
    expect(actual.todos.length).toEqual(2); // Should remain unchanged
  });

  it('should handle toggling a non-existent todo', () => {
    const state = {
      todos: [
        { id: '1', text: 'Test Todo', completed: false }
      ]
    };
    const actual = todoReducer(state, toggleTodo('999'));
    expect(actual.todos[0].completed).toEqual(false);
  });
}); 