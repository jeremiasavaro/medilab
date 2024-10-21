from .config import config 
import os
from dotenv import load_dotenv

load_dotenv()

def get_config():
    env = os.getenv('FLASK_ENV', 'development')
    if env == 'development' or env == 'testing':
        config_class = config.get(env)
    else:
        config_class = config.get('development')

    return config_class
    
