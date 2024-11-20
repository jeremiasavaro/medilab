# config.py
import os
from dotenv import load_dotenv
import cloudinary
import cloudinary.uploader

load_dotenv()

class Config(object):
    # Common configuration for all environments
    TESTING = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    @staticmethod
    def init_app():
        pass

class DevelopmentConfig(Config):
    # Configuration for development environment
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URI')
    SECRET_KEY = os.getenv('SECRET_KEY')
    DEBUG = True

class TestingConfig:
    # Configuration for testing environment
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    SECRET_KEY = os.getenv('SECRET_KEY')
    DEBUG = False

# Dictionary to map environment names to configuration classes
config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig
}