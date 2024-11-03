import sys
import os
import pytest

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from factory.__init__ import create_app
from config.config import TestingConfig  # Import the TestingConfig class

@pytest.fixture
def app():
    app = create_app(TestingConfig)
    with app.app_context():
        yield app

@pytest.fixture
def client(app):
    return app.test_client()