import React from 'react';

function LoginForm({ login, setLogin, handleLogin }) {
  return (
    <div>
      <h2>Login</h2>
      <form id="loginForm" onSubmit={handleLogin}>
        <input
          type="text"
          id="loginUsername"
          placeholder="Username"
          required
          value={login.username}
          onChange={e => setLogin({ ...login, username: e.target.value })}
        />
        <input
          type="password"
          id="loginPassword"
          placeholder="Password"
          required
          value={login.password}
          onChange={e => setLogin({ ...login, password: e.target.value })}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginForm;