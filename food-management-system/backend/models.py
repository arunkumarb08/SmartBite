"""
models.py
----------
Defines the SQLAlchemy ORM model for the 'Food' table.
This is the single source of truth for the database schema.
"""

from flask_sqlalchemy import SQLAlchemy

# db instance is created here and imported into app.py
# to avoid circular imports.
db = SQLAlchemy()


class Food(db.Model):
    """Represents a single row in the 'food' table."""

    __tablename__ = "food"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    food_name = db.Column(db.String(120), nullable=False)
    category = db.Column(db.String(80), nullable=False)
    price = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)

    def to_dict(self):
        """
        Converts the Food object into a plain Python dictionary
        so it can easily be serialized to JSON by Flask.
        """
        return {
            "id": self.id,
            "food_name": self.food_name,
            "category": self.category,
            "price": self.price,
            "quantity": self.quantity,
        }

    def __repr__(self):
        return f"<Food {self.id}: {self.food_name}>"
