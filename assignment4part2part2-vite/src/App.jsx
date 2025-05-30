import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import TodoApp from './components/TodoApp';
import './App.css';

const API_URL = 'http://localhost:3000';

function App() {
  const [authToken, setAuthToken] = useState('');
  const [showAuth, setShowAuth] = useState(true);
  const [todos, setTodos] = useState([]);
  const [register, setRegister] = useState({ username: '', password: '' });
  const [login, setLogin] = useState({ username: '', password: '' });
  const [todo, setTodo] = useState({ title: '', description: '' });

  // Auto-login if cookie exists
  useEffect(() => {
    const cookie = document.cookie.split('; ').find(row => row.startsWith('authToken='));
    if (cookie) {
      const token = cookie.split('=')[1];
      setAuthToken(token);
      setShowAuth(false);
    }
  }, []);

  useEffect(() => {
    if (authToken) fetchTodos();
  }, [authToken]);

  // Register
  const handleRegister = async (e) => {
    e.preventDefault();
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(register)
    });
    if (response.ok) {
      const data = await response.json();
      setAuthToken(data.token);
      document.cookie = `authToken=${data.token}`;
      setShowAuth(false);
    } else {
      alert('Registration failed');
    }
  };

  // Login
  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(login)
    });
    if (response.ok) {
      const data = await response.json();
      setAuthToken(data.token);
      document.cookie = `authToken=${data.token}`;
      setShowAuth(false);
    } else {
      alert('Login failed');
    }
  };

  // Logout
  const handleLogout = async () => {
    const response = await fetch(`${API_URL}/logout`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    if (response.ok) {
      setAuthToken('');
      document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
      setShowAuth(true);
      setTodos([]);
    } else {
      alert('Logout failed');
    }
  };

  // Fetch Todos
  const fetchTodos = async () => {
    const response = await fetch(`${API_URL}/todos`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    if (response.ok) {
      const todos = await response.json();
      setTodos(todos);
    } else {
      alert('Failed to fetch todos');
    }
  };

  // Add Todo
  const handleAddTodo = async (e) => {
    e.preventDefault();
    const response = await fetch(`${API_URL}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(todo)
    });
    if (response.ok) {
      const newTodo = await response.json();
      setTodos([...todos, newTodo]);
      setTodo({ title: '', description: '' });
      incrementMoves();
    } else {
      alert('Failed to add todo');
    }
  };

  // Edit Todo
  const handleEditTodo = async (id, currentTitle, currentDescription) => {
    const newTitle = prompt('Edit Title:', currentTitle);
    const newDescription = prompt('Edit Description:', currentDescription);
    if (newTitle === null) return;
    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: newTitle, description: newDescription })
    });
    if (response.ok) {
      fetchTodos();
      incrementMoves();
    } else {
      alert('Failed to update todo');
    }
  };

  // Delete Todo
  const handleDeleteTodo = async (id) => {
    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    if (response.ok) {
      fetchTodos();
      incrementMoves();
    } else {
      alert('Failed to delete todo');
    }
  };

  // Toggle Complete
  const handleToggleComplete = async (id, completed) => {
    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ completed: !completed })
    });
    if (response.ok) {
      fetchTodos();
      incrementMoves();
    } else {
      alert('Failed to update completion status');
    }
  };

  // Track Moves Across Tabs
  function incrementMoves() {
    let totalMoves = parseInt(localStorage.getItem('totalMoves')) || 0;
    totalMoves++;
    localStorage.setItem('totalMoves', totalMoves);
    console.log(`Total moves across tabs: ${totalMoves}`);
  }

  return (
    <div id="app">
      <Header />
      {showAuth ? (
        <div id="auth">
          <RegisterForm
            register={register}
            setRegister={setRegister}
            handleRegister={handleRegister}
          />
          <LoginForm
            login={login}
            setLogin={setLogin}
            handleLogin={handleLogin}
          />
        </div>
      ) : (
        <TodoApp
          todos={todos}
          todo={todo}
          setTodo={setTodo}
          handleAddTodo={handleAddTodo}
          handleLogout={handleLogout}
          handleEditTodo={handleEditTodo}
          handleDeleteTodo={handleDeleteTodo}
          handleToggleComplete={handleToggleComplete}
        />
      )}
    </div>
  );
}

export default App;
