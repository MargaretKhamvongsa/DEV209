import React from 'react';

function RegisterForm() {
  return (
    <div>
      <h2>Register</h2>
      <form id="registerForm">
        <input type="text" id="registerUsername" placeholder="Username" required />
        <input type="password" id="registerPassword" placeholder="Password" required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegisterForm;