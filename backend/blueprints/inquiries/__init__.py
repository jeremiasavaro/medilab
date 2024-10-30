from flask import Blueprint 

inquiries = Blueprint('inquiries',__name__)

from .routes import *