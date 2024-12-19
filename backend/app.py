from flask import Flask, request, jsonify
import mysql.connector
import logging
import os
from flask_cors import CORS
from datetime import datetime
import random
import re
from validators import validate_email, validate_aadhar, validate_pan, validate_balance
from queries import insert_customer, insert_account, fetch_info 


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow requests from all origins


# Configure MySQL database connection
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'mysqlboot',  # Replace with your MySQL password
    'database': 'bank'  # Replace with your database name
}

# Establish MySQL connection
def get_db_connection():
    connection = mysql.connector.connect(**db_config)
    return connection


# Route to open an account
@app.route('/open_account', methods=['POST'])
def open_account():

    data = request.form
    pancard_file = request.files.get('pancard_doc')
    aadhar_file = request.files.get('aadhar_doc')
    
    for file in [pancard_file, aadhar_file]:
        if not file or file.filename.split('.')[-1].lower() not in ['pdf', 'jpg']:
            return jsonify({"error": "Invalid document format. Only PDF and JPG are allowed."}), 400
    
    try:
        # generating customerid
        current_date = datetime.now().strftime('%d%H%M%S')
        customerid = f"{current_date}"



        # Create main uploads directory if it doesn't exist
        base_upload_dir = 'uploads'
        os.makedirs(base_upload_dir, exist_ok=True)

        customer_dir = os.path.join(base_upload_dir, customerid)
        os.makedirs(customer_dir, exist_ok=True)

        pancard_filename = f"pan_{pancard_file.filename}"
        aadhar_filename = f"aadhar_{aadhar_file.filename}"

        pancard_path = os.path.join(customer_dir, pancard_filename)
        aadhar_path = os.path.join(customer_dir, aadhar_filename)

        pancard_file.save(pancard_path)
        aadhar_file.save(aadhar_path)
        


        email = data['email']
        aadharcard = data['aadharcard']
        pancard = data['pancard']



        # Validate data
        if not validate_email(email):
            return jsonify({'error': 'Invalid email format'}), 400
        
        if not validate_aadhar(aadharcard):
            return jsonify({'error': 'Invalid Aadhar number'}), 400
        
        if not validate_pan(pancard):
            return jsonify({'error': 'Invalid PAN format'}), 400
        
        


        # for acount table
        account_type = request.form.get('accounttype')
        balance = float(request.form.get('balance', 0))

        # Validate balance based on account type
        is_valid_balance, balance_error = validate_balance(account_type, balance)
        if not is_valid_balance:
            return jsonify({"error": balance_error}), 400



        accountid = int(str(customerid)[::-1])
        branchid = data['branchid']
        accounttype = data['accounttype']
        accountnumber = datetime.now().strftime('%y%m%H%M%S')
        openingdate = datetime.now()
        balance = float(data['balance'])
        status = 'active'

        customer_values = (
            customerid,
            data['firstname'], 
            data['lastname'], 
            data['dob'], 
            data['address'], 
            data['phone'], 
            email, 
            aadharcard,
            pancard
        )
        account_values = (
            accountid,
            customerid,
            branchid,
            accounttype,
            accountnumber,
            openingdate,
            balance,
            status
        )
        
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute(insert_customer, customer_values)
        cursor.execute(insert_account, account_values)
        connection.commit()
        connection.close()
        
        return jsonify({
            "message": "Account created successfully!",
            "customer_id": customerid,
            "accountnumber":accountnumber}), 201
    except mysql.connector.Error as err:
        return jsonify({"error": f"Database error: {err}"}), 500
    

# Route to fetch account information based on customerid and accountnumber
@app.route('/get_details', methods=['POST'])
def get_account_info():
    data = request.get_json()
    customer_id = data.get('customerid')
    account_number = data.get('accountnumber')

    try:
        # Establish a new connection
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(fetch_info, (customer_id, account_number))
        result = cursor.fetchone()

        cursor.close()
        connection.close()

        if result:
            customer_details = {
                'customerName': result[0],
                'accountType': result[1],
                'balance': float(result[2]),
                'status': result[3]
            }
            return jsonify(customer_details), 200
        else:
            return jsonify({'message': 'Customer not found'}), 404

    except Exception as e:
        logging.error(f"Error: {str(e)}")  # Log the error
        return jsonify({'message': f'Error: {str(e)}'}), 500


if __name__ == "__main__":
    app.run(host='0.0.0.0',port=5000,debug=True)
