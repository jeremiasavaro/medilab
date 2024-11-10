#medilab\backend\app.py
from flask import Flask
from flask_cors import CORS
from io import BytesIO
from utils import handle_options_requests
from factory.__init__ import create_app

#Create the app
app = create_app()

handle_options_requests(app)

if __name__ == '__main__':
    app.run(debug=False)