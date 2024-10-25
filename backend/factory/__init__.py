import os
from flask import Flask
from flask_cors import CORS
from db.database import db, migrate
from db.functions_db import *
from db.models import *
from config import *
from cloudinary import config as cloudinary_config
from tensorflow.keras.models import load_model

#blueprints import
from blueprints.auth.__init__ import auth


#load environment variables
load_dotenv()

#load cloudinary configuration
cloudinary_config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET')
)

#load model global variable
MODEL_PATH = os.getenv('MODEL_PATH')
model = load_model(MODEL_PATH)


def create_app(config_class=None):
    app = Flask(__name__)

    # Configure CORS with support for credentials and allow all origins
    CORS(app, supports_credentials=True, origins=['http://localhost:3000'])

    #load configuration
    if not config_class:
        config_class = get_config() #obtain the configuration class
    app.config.from_object(config_class) #load the configuration
   
    print(app.config['SQLALCHEMY_DATABASE_URI'])

    db.init_app(app)
    migrate.init_app(app, db)

    app.model = model

    # each blueprint is registered
    app.register_blueprint(auth, url_prefix="/auth")


    return app