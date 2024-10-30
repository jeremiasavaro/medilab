from flask import Blueprint

xray = Blueprint('xray',__name__)

from .routes import *