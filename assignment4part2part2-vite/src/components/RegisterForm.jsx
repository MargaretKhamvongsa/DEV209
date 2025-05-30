import React from 'react';

function RegisterForm({ register, setRegister, handleRegister }) {
  return (
    <div>
      <h2>Register</h2>
      <form id="registerForm" onSubmit={handleRegister}>
        <input
          type="text"
          id="registerUsername"
          placeholder="Username"
          required
          value={register.username}
          onChange={e => setRegister({ ...register, username: e.target.value })}
        />
        <input
          type="password"
          id="registerPassword"
          placeholder="Password"
          required
          value={register.password}
          onChange={e => setRegister({ ...register, password: e.target.value })}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegisterForm;