// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css'; // Import your navbar CSS file

const Navbar = () => {
    return (
        <nav>
            <ul>
                <li><Link to="/" className="active">Home</Link></li>
                <li><Link to="/map">Map</Link></li>
                <li><Link to="/form">Form</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;
