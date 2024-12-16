// src/SuccessPage.js
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './SuccessPage.css';

function SuccessPage() {
    const location = useLocation();
    const { accountDetails } = location.state || {};

    return (
        <div className="success-container">
            <div className="success-card">
                <h1>Account Created Successfully!</h1>
                <div className="account-details">
                    <h2>Account Information</h2>
                    {accountDetails ? (
                        <>
                            <p><strong>Customer ID:</strong> {accountDetails.customerId}</p>
                            <p><strong>Account Number:</strong> {accountDetails.accountNumber}</p>
                            <p><strong>Account Type:</strong> {accountDetails.accountType}</p>
                            <p><strong>Branch:</strong> {accountDetails.branchName}</p>
                        </>
                    ) : (
                        <p>No account details available</p>
                    )}
                </div>
                <Link to="/" className="home-button">Back to Home</Link>
            </div>
        </div>
    );
}

export default SuccessPage;
