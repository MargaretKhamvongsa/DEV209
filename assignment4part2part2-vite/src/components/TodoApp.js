import React from 'react';

function TodoApp({
  todos,
  todo,
  setTodo,
  handleAddTodo,
  handleLogout,
  handleEditTodo,
  handleDeleteTodo,
  handleToggleComplete
}) {
  return (
    <div id="todoApp">
      <button id="logoutButton" onClick={handleLogout}>Logout</button>
      <h2>Todo List</h2>
      <form id="todoForm" onSubmit={handleAddTodo}>
        <input
          type="text"
          id="todoTitle"
          placeholder="Title"
          required
          value={todo.title}
          onChange={e => setTodo({ ...todo, title: e.target.value })}
        />
        <input
          type="text"
          id="todoDescription"
          placeholder="Description"
          value={todo.description}
          onChange={e => setTodo({ ...todo, description: e.target.value })}
        />
        <button type="submit">Add Todo</button>
      </form>
      <ul id="todoList">
        {todos.map(todo => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            {todo.title} - {todo.description}
            <button onClick={() => handleToggleComplete(todo.id, todo.completed)}>
              {todo.completed ? 'Undo' : 'Complete'}
            </button>
            <button onClick={() => handleEditTodo(todo.id, todo.title, todo.description)}>
              Edit
            </button>
            <button onClick={() => handleDeleteTodo(todo.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;