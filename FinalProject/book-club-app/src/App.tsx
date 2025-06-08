import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Club from './pages/Club';
import Login from './pages/Login';

const App: React.FC = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={
                    <main>
                        <h1>Welcome to the Book Club!</h1>
                        <p>This is your custom homepage.</p>
                    </main>
                } />
                <Route path="/club" element={<Club />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </Router>
    );
};

export default App;