import React, { useState } from "react";
import "./ViewAccount.css";

function ViewAccount() {
  const [formData, setFormData] = useState({
    customerid: "",
    accountnumber: ""  // Changed back to accountnumber
  });
  const [customerDetails, setCustomerDetails] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.customerid.trim()) {
      tempErrors.customerid = "Customer ID is required";
    }
    if (!formData.accountnumber.trim()) {  // Changed to accountnumber
      tempErrors.accountnumber = "Account Number is required";  // Changed to accountnumber
    } else if (!/^\d+$/.test(formData.accountnumber)) {  // Changed to accountnumber
      tempErrors.accountnumber = "Account Number must contain only numbers";  // Changed to accountnumber
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

        if (response.ok) {
          const data = await response.json();
          setCustomerDetails(data);
          setErrors({});
        } else {
          const errorData = await response.json();
          setErrors({
            submit: errorData.message || "Invalid Customer ID or Account Number"
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
          <button type="submit" className="submit-button">
            View Account
          </button>
        </div>
      </form>

      {customerDetails && (
        <div className="customer-details">
          <h3>Customer Details</h3>
          <div className="details-container">
            <div className="detail-row">
              <span className="detail-label">Customer Name:</span>
              <span className="detail-value">{customerDetails.customerName}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Account Type:</span>
              <span className="detail-value">{customerDetails.accountType}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Balance:</span>
              <span className="detail-value">र्{customerDetails.balance}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Account Status:</span>
              <span className="detail-value">{customerDetails.status}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewAccount;
