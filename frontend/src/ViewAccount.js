import React, { useState } from "react";
import "./ViewAccount.css";
import { useNavigate } from "react-router-dom";
import CustomerDetailsPage from "./CustomerDetailsPage";

function ViewAccount() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerid: "",
    accountnumber: ""  // Changed back to accountnumber
  });
  const [customerDetails, setCustomerDetails] = useState(null);
  const [errors, setErrors] = useState({});
  const [showDetailsPage, setShowDetailsPage] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) {
      setErrors( preState => ({
        ...preState,
        [name]: ""
      }));
    }
  };


  const validateForm = () => {
    let tempErrors = {};
    if (!formData.customerid.trim()) {
      tempErrors.customerid = "Customer ID is required";
    }
    if (!formData.accountnumber.trim()) {  
      tempErrors.accountnumber = "Account Number is required"; 
    } else if (!/^\d+$/.test(formData.accountnumber)) { 
      tempErrors.accountnumber = "Account Number must contain only numbers"; 
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await fetch("http://localhost:5000/get_details", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();
        console.log('Customer Details received:', data);
        if (response.ok) {
          setCustomerDetails(data);
          setShowDetailsPage(true);
          setErrors({});
        } else {
          setErrors({
            submit: data.message || "Invalid Customer ID or Account Number"
          });
          setCustomerDetails(null);
        }
      } catch (error) {
        console.error("Error:", error);
        setErrors({
          submit: "Error connecting to server"
        });
        setCustomerDetails(null);
      }
    }
  };

  const handleClose = () => {
    setShowDetailsPage(false);
    setCustomerDetails(null);
    // Reset form
    setFormData({
      customerid: '',
      accountnumber: ''
    });
  };

  return (
    <div className="view-account-container">
      <h2>View Account Details</h2>
      <form onSubmit={handleSubmit} className="view-account-form">
        <div className="form-group">
          <label htmlFor="customerid">Customer ID:</label>
          <input
            type="text"
            id="customerid"
            name="customerid"
            value={formData.customerid}
            onChange={handleChange}
            className={errors.customerid ? "error-input" : ""}
          />
          {errors.customerid && (
            <span className="error-message">{errors.customerid}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="accountnumber">Account Number:</label>
          <input
            type="text"
            id="accountnumber"
            name="accountnumber"
            value={formData.accountnumber}
            onChange={handleChange}
            className={errors.accountnumber ? "error-input" : ""}
          />
          {errors.accountnumber && (
            <span className="error-message">{errors.accountnumber}</span>
          )}
        </div>

        {errors.submit && (
          <div className="error-message submit-error">{errors.submit}</div>
        )}

        <div className="button-group">
          <button type="submit" onClick={() => navigate('/')} className="back-button">
            Back
          </button>
          <button type="submit" className="submit-button">
            View Account
          </button>
        </div>
      </form>

      {/* Render CustomerDetailsPage as an overlay when showDetailsPage is true */}
      {showDetailsPage && customerDetails && (
        <CustomerDetailsPage 
          customerDetails={customerDetails}
          onClose={handleClose}
        />
      )}
    </div>
  );
}

export default ViewAccount;
