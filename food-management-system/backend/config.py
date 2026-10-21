"""
config.py
----------
Central configuration for the Flask application.
Keeping config separate makes it easy to switch between
development / testing / production settings later.
"""

import os

# Absolute path to the backend folder so the SQLite file
# is always created in a predictable location regardless
# of where the app is launched from.
BASE_DIR = os.path.abspath(os.path.dirname(__file__))


class Config:
    """Base configuration class used by the Flask app."""

    # SQLite database file stored inside the backend folder
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.path.join(BASE_DIR, 'database.db')}"

    # Disables an SQLAlchemy feature we don't need (saves memory / avoids warnings)
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Pretty-print JSON responses (helpful during development)
    JSONIFY_PRETTYPRINT_REGULAR = True
