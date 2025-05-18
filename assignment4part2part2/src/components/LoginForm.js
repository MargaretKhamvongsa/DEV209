import React from 'react';

function LoginForm() {
  return (
    <div>
      <h2>Login</h2>
      <form id="loginForm">
        <input type="text" id="loginUsername" placeholder="Username" required />
        <input type="password" id="loginPassword" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginForm;