#config.py
import os

from dotenv import load_dotenv
import cloudinary
import cloudinary.uploader

load_dotenv()

class Config(object):
    #Configuracion comun para todos los ambientes
    TESTING = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    @staticmethod
    def init_app():
        pass

class DevelopmentConfig(Config):
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URI')
    SECRET_KEY = os.getenv('SECRET_KEY')
    DEBUG = True


class TestingConfig(Config):
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    TESTING = True
    DEBUG = False

config = {
    'development': DevelopmentConfig,
    'testing':TestingConfig
}
    
