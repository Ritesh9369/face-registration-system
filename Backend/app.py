from flask import Flask, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from routes.Register_routes.Register_routes import register_bp

load_dotenv()

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", "uploads")
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.register_blueprint(register_bp)

@app.route("/")
def home():
    return "🚀 Face AI Backend Running"

@app.route("/api/test")
def test():
    return jsonify({"status": "Backend Working ✅"})

if __name__ == "__main__":
    print("🔥 Server Running...")
    app.run(debug=True)

