# Mini Food Management System

A full-stack CRUD application: **React (Vite) + Bootstrap 5** frontend and
**Flask + Flask-RESTful + SQLAlchemy + SQLite** backend.

---

## 1. Folder Structure

```
food-management-system/
├── backend/
│   ├── app.py
│   ├── models.py
│   ├── config.py
│   └── requirements.txt
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── api/foodApi.js
        ├── components/Navbar.jsx
        ├── components/Notification.jsx
        └── pages/Home.jsx, FoodList.jsx, AddFood.jsx, EditFood.jsx
```

---

## 2. Install Dependencies

### Backend (Python)
Open a terminal in VS Code, navigate to the backend folder:

```bash
cd food-management-system/backend
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

### Frontend (Node.js — requires Node 18+)
In a **second terminal**:

```bash
cd food-management-system/frontend
npm install
```

---

## 3. Run the Flask Backend

```bash

suppose need to update version
Upgrade SQLAlchemy (try this first)
Activate your virtual environment and run:

pip uninstall sqlalchemy
pip install SQLAlchemy==2.0.43

cd food-management-system/backend
python app.py
```

- Server runs at: **http://127.0.0.1:5000**
- `database.db` (SQLite file) is created automatically on first run.
- Visit `http://127.0.0.1:5000/` in a browser — you should see a JSON health-check message.

---

## 4. Run the React Frontend

```bash
cd food-management-system/frontend
npm run dev
```

- App runs at: **http://127.0.0.1:5173**
- Vite will print the exact local URL in the terminal.

---

## 5. Connect Frontend and Backend

Already wired up — no extra config needed:

- `frontend/src/api/foodApi.js` points Axios to `http://127.0.0.1:5000`.
- `backend/app.py` has `CORS(app)` enabled, allowing requests from the Vite dev server.

**Important:** both servers (Flask on :5000 and Vite on :5173) must be running
at the same time for the app to work.

---

## 6. Test All CRUD Operations

With both servers running, open **http://127.0.0.1:5173** in your browser:

| Action | How to test |
|---|---|
| **Create** | Go to "Add Food", fill the form, click "Save Food" → redirects to Food List with new item visible |
| **Read (list)** | Go to "Food List" → all items load from `GET /foods` |
| **Read (single)** | Click "Edit" on any row → loads that item via `GET /foods/<id>` |
| **Update** | On the Edit page, change values, click "Update Food" → item updates via `PUT /foods/<id>` |
| **Delete** | Click "Delete" on a row, confirm in the modal → removes item via `DELETE /foods/<id>` |
| **Search** | Type in the search box on Food List → filters via `GET /foods?search=term` |
| **Validation** | Try submitting an empty form or a negative price → inline errors shown, no request sent |
| **Error handling** | Stop the Flask server and try loading Food List → red error notification appears |

You can also test the API directly with `curl`:

```bash
# Get all foods
curl http://127.0.0.1:5000/foods

# Create a food
curl -X POST http://127.0.0.1:5000/foods \
  -H "Content-Type: application/json" \
  -d '{"food_name":"Idli","category":"Breakfast","price":40,"quantity":10}'

# Update a food (id=1)
curl -X PUT http://127.0.0.1:5000/foods/1 \
  -H "Content-Type: application/json" \
  -d '{"price":45}'

# Delete a food (id=1)
curl -X DELETE http://127.0.0.1:5000/foods/1
```

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| GET | `/foods` | Get all food items (supports `?search=`) |
| GET | `/foods/<id>` | Get a single food item |
| POST | `/foods` | Create a new food item |
| PUT | `/foods/<id>` | Update an existing food item |
| DELETE | `/foods/<id>` | Delete a food item |
