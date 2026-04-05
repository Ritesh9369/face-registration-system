from flask import Flask, jsonify
from flask_cors import CORS
import os
import warnings
import logging

# ✅ Sab logs band karo
warnings.filterwarnings('ignore')
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
logging.getLogger('insightface').setLevel(logging.ERROR)
logging.getLogger('onnxruntime').setLevel(logging.ERROR)

from dotenv import load_dotenv
from routes.Register_routes.Register_routes import register_bp
from routes.live_verify_routes.live_verify_routes import live_verify_bp
from routes.verify_routes.verify_routes import verify_bp

load_dotenv()

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", "uploads")
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.register_blueprint(register_bp)
app.register_blueprint(live_verify_bp)
app.register_blueprint(verify_bp)

@app.route("/")
def home():
    return "🚀 Face AI Backend Running"

@app.route("/api/test")
def test():
    return jsonify({"status": "Backend Working ✅"})

if __name__ == "__main__":
    print("🔥 Server Running...")
    app.run(debug=True)