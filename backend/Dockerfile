# Backend Dockerfile
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy requirements first to leverage Docker cache
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Expose port
EXPOSE 5000

# Environment variables for MySQL connection
ENV MYSQL_HOST=db
ENV MYSQL_USER=root
ENV MYSQL_PASSWORD=mysqlboot
ENV MYSQL_DATABASE=bank

# Command to run the application
CMD ["python", "app.py"]
