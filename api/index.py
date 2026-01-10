from flask import Flask
import os
import sys

# Add the parent directory to sys.path so we can import 'Backend'
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.join(current_dir, '..')
sys.path.append(parent_dir)

# Import the Flask app instance from your main backend file
from Backend.app import app

# Vercel needs the app object to be exposed directly
# This file acts as the WSGI entry point
