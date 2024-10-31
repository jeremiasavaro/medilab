#!/bin/bash

# Initialize the database with flask 
echo "Initializing database..."
pipenv run flask db init

# Generate the database migration
echo "Generating migrate..."
pipenv run flask db migrate

# Apply migrations
echo "Applying all migrations..."
pipenv run flask db upgrade

echo "Database configuration process completed."