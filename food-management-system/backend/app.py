"""
app.py
-------
Entry point for the Flask backend.

Sets up:
- Flask app + CORS (so the React frontend on a different port can call it)
- SQLAlchemy database connection
- Flask-RESTful API resources for full CRUD on the Food table
- Input validation and error handling
"""

from flask import Flask, request
from flask_restful import Api, Resource
from flask_cors import CORS

from config import Config
from models import Food, db

# ---------------------------------------------------------------
# App initialization
# ---------------------------------------------------------------
app = Flask(__name__)
app.config.from_object(Config)

# Allow requests from the React dev server (Vite default: localhost:5173)
CORS(app)

db.init_app(app)
api = Api(app)

# Create the database tables on startup if they don't exist yet.
with app.app_context():
    db.create_all()


# ---------------------------------------------------------------
# Helper: validate incoming food payload
# ---------------------------------------------------------------
def validate_food_data(data, partial=False):
    """
    Validates the JSON body sent by the client.

    Returns (cleaned_data, errors_list).
    If `partial` is True, missing fields are allowed (used for PUT
    where the client might only send some fields) — but any field
    that IS present must still be valid.
    """
    errors = []
    cleaned = {}

    required_fields = ["food_name", "category", "price", "quantity"]

    for field in required_fields:
        if field not in data:
            if not partial:
                errors.append(f"'{field}' is required.")
            continue

        value = data[field]

        if field == "food_name":
            if not isinstance(value, str) or not value.strip():
                errors.append("'food_name' must be a non-empty string.")
            else:
                cleaned["food_name"] = value.strip()

        elif field == "category":
            if not isinstance(value, str) or not value.strip():
                errors.append("'category' must be a non-empty string.")
            else:
                cleaned["category"] = value.strip()

        elif field == "price":
            try:
                price_val = float(value)
                if price_val < 0:
                    errors.append("'price' cannot be negative.")
                else:
                    cleaned["price"] = price_val
            except (TypeError, ValueError):
                errors.append("'price' must be a number.")

        elif field == "quantity":
            try:
                qty_val = int(value)
                if qty_val < 0:
                    errors.append("'quantity' cannot be negative.")
                else:
                    cleaned["quantity"] = qty_val
            except (TypeError, ValueError):
                errors.append("'quantity' must be an integer.")

    return cleaned, errors


# ---------------------------------------------------------------
# Resource: /foods  (GET all, POST new)
# ---------------------------------------------------------------
class FoodListResource(Resource):
    def get(self):
        """Return all food items. Supports optional ?search= query param."""
        search_term = request.args.get("search", "").strip()

        query = Food.query
        if search_term:
            # Case-insensitive partial match on food_name or category
            like_pattern = f"%{search_term}%"
            query = query.filter(
                (Food.food_name.ilike(like_pattern)) | (Food.category.ilike(like_pattern))
            )

        foods = query.order_by(Food.id.desc()).all()
        return {"success": True, "data": [f.to_dict() for f in foods]}, 200

    def post(self):
        """Create a new food item."""
        json_data = request.get_json(silent=True)

        if not json_data:
            return {"success": False, "message": "Request body must be valid JSON."}, 400

        cleaned, errors = validate_food_data(json_data, partial=False)
        if errors:
            return {"success": False, "message": "Validation failed.", "errors": errors}, 400

        try:
            new_food = Food(
                food_name=cleaned["food_name"],
                category=cleaned["category"],
                price=cleaned["price"],
                quantity=cleaned["quantity"],
            )
            db.session.add(new_food)
            db.session.commit()
            return {"success": True, "message": "Food item created.", "data": new_food.to_dict()}, 201

        except Exception as e:
            db.session.rollback()
            return {"success": False, "message": f"Server error: {str(e)}"}, 500


# ---------------------------------------------------------------
# Resource: /foods/<id>  (GET one, PUT update, DELETE)
# ---------------------------------------------------------------
class FoodResource(Resource):
    def get(self, food_id):
        """Return a single food item by id."""
        food = Food.query.get(food_id)
        if not food:
            return {"success": False, "message": f"Food with id {food_id} not found."}, 404
        return {"success": True, "data": food.to_dict()}, 200

    def put(self, food_id):
        """Update an existing food item."""
        food = Food.query.get(food_id)
        if not food:
            return {"success": False, "message": f"Food with id {food_id} not found."}, 404

        json_data = request.get_json(silent=True)
        if not json_data:
            return {"success": False, "message": "Request body must be valid JSON."}, 400

        cleaned, errors = validate_food_data(json_data, partial=True)
        if errors:
            return {"success": False, "message": "Validation failed.", "errors": errors}, 400

        if not cleaned:
            return {"success": False, "message": "No valid fields provided to update."}, 400

        try:
            for key, value in cleaned.items():
                setattr(food, key, value)
            db.session.commit()
            return {"success": True, "message": "Food item updated.", "data": food.to_dict()}, 200

        except Exception as e:
            db.session.rollback()
            return {"success": False, "message": f"Server error: {str(e)}"}, 500

    def delete(self, food_id):
        """Delete a food item."""
        food = Food.query.get(food_id)
        if not food:
            return {"success": False, "message": f"Food with id {food_id} not found."}, 404

        try:
            db.session.delete(food)
            db.session.commit()
            return {"success": True, "message": "Food item deleted."}, 200
        except Exception as e:
            db.session.rollback()
            return {"success": False, "message": f"Server error: {str(e)}"}, 500


# ---------------------------------------------------------------
# Register routes
# ---------------------------------------------------------------
api.add_resource(FoodListResource, "/foods")
api.add_resource(FoodResource, "/foods/<int:food_id>")


# ---------------------------------------------------------------
# Root route (simple health check)
# ---------------------------------------------------------------
@app.route("/")
def index():
    return {"message": "Mini Food Management System API is running."}


# ---------------------------------------------------------------
# Global error handlers
# ---------------------------------------------------------------
@app.errorhandler(404)
def not_found(e):
    return {"success": False, "message": "Resource not found."}, 404


@app.errorhandler(500)
def server_error(e):
    return {"success": False, "message": "Internal server error."}, 500


if __name__ == "__main__":
    # debug=True enables auto-reload during development
    app.run(debug=True, port=5000)
