from flask import Flask, request, jsonify
import mysql.connector
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow requests from all origins


# Configure MySQL database connection
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'mysqlboot',  # Replace with your MySQL password
    'database': 'banking'  # Replace with your database name
}

# Establish MySQL connection
def get_db_connection():
    connection = mysql.connector.connect(**db_config)
    return connection

# Route to open an account
@app.route('/open_account', methods=['POST'])
@app.route('/open_account/', methods=['POST'])  # Support with and without trailing slash
def open_account():
    print(request.method)  # Debug info
    print(request.form)  # Debug info
    print(request.files)  # Debug info

    data = request.form
    file = request.files.get('document')
    
    if not file or file.filename.split('.')[-1].lower() not in ['pdf', 'jpg']:
        return jsonify({"error": "Invalid document format. Only PDF and JPG are allowed."}), 400
    
    try:
        doc_path = os.path.join('uploads', file.filename)
        os.makedirs('uploads', exist_ok=True)
        file.save(doc_path)
        
        query = """
        INSERT INTO Customer (FirstName, LastName, Email, Phone, Address, AadharCard, PanCard) 
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        values = (
            data['first_name'], 
            data['last_name'], 
            data['email'], 
            data['phone'], 
            data['address'], 
            data['AadharCard'], 
            data['PanCard']
        )
        
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute(query, values)
        connection.commit()
        connection.close()
        
        return jsonify({"message": "Account created successfully!"}), 201
    except mysql.connector.Error as err:
        return jsonify({"error": f"Database error: {err}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
