#app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from io import BytesIO
import tensorflow as tf
from utils import handle_options_requests, make_response, decode_token
from datetime import datetime
from db.functions_db import *
from db.models import *
from config.config import *
from factory.__init__ import create_app

#Create the app
app = create_app()

#???
handle_options_requests(app)


if __name__ == '__main__':
    app.run(debug=False)