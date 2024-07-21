

import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const LandingPage = () => {
    return (
        <div className="landing-page">
            <h1>Choose your role</h1>
            <Link to="/manager">
                <button>Manager</button>
            </Link>
            <Link to="/map">
                <button>Worker</button>
            </Link>
        </div>
    );
};

export default LandingPage;

