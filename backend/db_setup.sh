#!/bin/bash

# Initialize the database with flask 
echo "Initializing database..."
flask db init

# Generate the database migration
echo "Generating migrate..."
flask db migrate

# Apply migrations
echo "Applying all migrations..."
flask db upgrade

echo "Database configuration process completed."