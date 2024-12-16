import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <h1>Welcome to NASA Bank</h1>
            <div className="button-container">
                <button className="action-button" onClick={() => navigate('/signup')}>
                    Sign Up
                </button>
                <button className="action-button" disabled>
                    Sign In
                </button>
            </div>
        </div>
    );
}

export default Home;
