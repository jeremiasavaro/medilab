#backend\factory\__init__.py
import os
from flask import Flask
from flask_cors import CORS
from db.database import db, migrate
from db.functions_db import *
from db.models import *
from config import *
from cloudinary import config as cloudinary_config
from tensorflow.keras.models import load_model

# Blueprints import
from blueprints.auth.__init__ import auth
from blueprints.user.__init__ import user
from blueprints.xray.__init__ import xray
from blueprints.inquiries.__init__ import inquiries
from blueprints.image.__init__ import image

# Load environment variables
load_dotenv()

# Load cloudinary configuration
cloudinary_config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET')
)

def create_app(config_class=None):
    app = Flask(__name__)

    # Configure CORS with support for credentials and allow all origins
    CORS(app, supports_credentials=True, origins=['http://localhost:3000'])

    # Load configuration
    if not config_class:
        config_class = get_config() # Obtain the configuration class
    app.config.from_object(config_class) # Load the configuration
   
    print(app.config['SQLALCHEMY_DATABASE_URI'])

    db.init_app(app)
    migrate.init_app(app, db)

    # Each blueprint is registered
    app.register_blueprint(auth, url_prefix="/auth")
    app.register_blueprint(user, url_prefix="/user")
    app.register_blueprint(xray, url_prefix="/xray")
    app.register_blueprint(inquiries, url_prefix="/inquiries")
    app.register_blueprint(image, url_prefix="/image")

    return app