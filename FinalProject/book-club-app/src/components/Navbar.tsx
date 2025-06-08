import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => (
  <nav>
    <ul>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/club">Club</Link></li>
      <li><Link to="/login">Login</Link></li>
    </ul>
  </nav>
);

export default Navbar;