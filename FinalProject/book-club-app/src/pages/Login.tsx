import React from 'react';

const Login: React.FC = () => (
  <main>
    <h1>Login</h1>
    <form>
      <label>
        Email:
        <input type="email" />
      </label>
      <label>
        Password:
        <input type="password" />
      </label>
      <button type="submit">Login</button>
    </form>
  </main>
);

export default Login;