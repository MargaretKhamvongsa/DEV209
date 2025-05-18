import React from 'react';

function TodoApp() {
  return (
    <div id="todoApp" style={{ display: 'none' }}>
      <button id="logoutButton">Logout</button>
      <h2>Todo List</h2>
      <form id="todoForm">
        <input type="text" id="todoTitle" placeholder="Title" required />
        <input type="text" id="todoDescription" placeholder="Description" />
        <button type="submit">Add Todo</button>
      </form>
      <ul id="todoList"></ul>
    </div>
  );
}

export default TodoApp;