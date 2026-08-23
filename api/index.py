import os
import sys

# Ensure backend folder is in Python path for Vercel serverless environment
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from backend.simple_chat_backend import app
