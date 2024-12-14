import React, { useState } from 'react';

function App() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    AadharCard: '',
    PanCard: '',
    document: null
  });
  const [message, setMessage] = useState('');

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    
    // Append all form data fields
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });

    console.log('FormData sent:', formDataToSend); // Debug log to see if formData is correct
    
    try {
      const response = await fetch('http://127.0.0.1:5000/open_account', {
        method: 'POST',
        body: formDataToSend
      });
      const data = await response.json();
      setMessage(data.message || data.error);
    } catch (error) {
      console.log('Error:', error); // Debug log
      setMessage('An error occurred while creating the account.');
    }
  };

  return (
    <div>
      <h1>Bank Account Opening</h1>
      <form onSubmit={handleSubmit}>
  {/* Form Fields */}
  <label htmlFor="first_name">First Name</label>
  <input
    type="text"
    id="first_name"
    name="first_name"
    onChange={handleChange}
    required
  />

  <label htmlFor="last_name">Last Name</label>
  <input
    type="text"
    id="last_name"
    name="last_name"
    onChange={handleChange}
    required
  />

  <label htmlFor="email">Email</label>
  <input
    type="email"
    id="email"
    name="email"
    onChange={handleChange}
    required
  />

  <label htmlFor="phone">Phone Number</label>
  <input
    type="tel"
    id="phone"
    name="phone"
    onChange={handleChange}
    required
  />

  <label htmlFor="address">Address</label>
  <textarea
    id="address"
    name="address"
    onChange={handleChange}
    required
  />

  <label htmlFor="PanCard">Pan Card Number</label>
  <input
    type="text"
    id="PanCard"
    name="PanCard"
    onChange={handleChange}
    required
  />

  <label htmlFor="AadharCard">Aadhar Card Number</label>
  <input
    type="text"
    id="AadharCard"
    name="AadharCard"
    onChange={handleChange}
    required
  />

  <label htmlFor="document">Upload Document</label>
  <input
    type="file"
    id="document"
    name="document"
    accept=".pdf,.jpg"
    onChange={handleChange}
    required
  />

  <button type="submit">Open Account</button>
</form>

      
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
