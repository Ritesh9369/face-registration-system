import os
import base64
import numpy as np
import cv2
from flask import request, jsonify
from insightface.app import FaceAnalysis
from models.Register_models.Register_models import save_user, save_face
from config.db import get_db_connection

# 🔥 AI Model Load
face_app = FaceAnalysis()
face_app.prepare(ctx_id=0)

UPLOAD_FOLDER = "uploads"

def register_user():
    try:
        data = request.json
        name   = data.get("name")
        email  = data.get("email")
        role   = data.get("role")
        gender = data.get("gender")
        image  = data.get("image")

        # ✅ Validation
        if not name or not email or not role or not gender or not image:
            return jsonify({"error": "All fields required!"}), 400

        # ✅ Image decode
        img_data = base64.b64decode(image.split(",")[1])
        img_np = np.frombuffer(img_data, np.uint8)
        img = cv2.imdecode(img_np, cv2.IMREAD_COLOR)

        # ✅ Face dhundo
        faces = face_app.get(img)
        if len(faces) == 0:
            return jsonify({"error": "No face detected!"}), 400

        # ✅ Naye user ki encoding
        new_encoding = np.array(faces[0].embedding)

        # ✅ Database se saari encodings lo
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT user_id, encoding FROM face_data")
        all_faces = cursor.fetchall()
        cursor.close()
        conn.close()

        # ✅ Har face se compare karo
        for (user_id, encoding_str) in all_faces:
            old_encoding = np.array(eval(encoding_str))
            similarity = np.dot(new_encoding, old_encoding) / (
                np.linalg.norm(new_encoding) * np.linalg.norm(old_encoding)
            )
            if similarity > 0.5:
                return jsonify({"error": "Face already registered!"}), 400

        # ✅ Image save karo
        file_path = os.path.join(UPLOAD_FOLDER, f"{name}.png")
        with open(file_path, "wb") as f:
            f.write(img_data)

        # ✅ Database mein save karo
        encoding = new_encoding.tolist()
        user_id = save_user(name, email, role, gender)
        save_face(user_id, file_path, str(encoding))

        return jsonify({"message": f"{name} registered successfully!"}), 200

    except Exception as e:
        print(f"[ERROR] ❌ {str(e)}")
        return jsonify({"error": str(e)}), 500