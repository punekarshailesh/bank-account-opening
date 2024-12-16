# queries.py

# Customer related queries
insert_customer= """
    INSERT INTO customer (customerid, firstname, lastname, dob, address, phone, email, aadharcard, pancard) 
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
"""

# Account related queries
insert_account = """
    INSERT INTO account (accountid, customerid, branchid, accounttype, 
                accountnumber, openingdate, balance, status)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
"""
