import React from 'react';
import Header from './components/Header';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import TodoApp from './components/TodoApp';
import './App.css';

function App() {
  return (
    <div id="app">
      <Header />
      <div id="auth">
        <RegisterForm />
        <LoginForm />
      </div>
      <TodoApp />
    </div>
  );
}

export default App;
