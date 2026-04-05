import cv2
import numpy as np
import base64
from flask import request, jsonify
from insightface.app import FaceAnalysis
from models.live_verify_models.live_verify_models import get_all_faces, save_verification_log

# 🔥 AI Model Load
face_app = FaceAnalysis()
face_app.prepare(ctx_id=0)

def live_verify():
    try:
        data = request.json
        image = data.get("image")

        if not image:
            return jsonify({"error": "Image required!"}), 400

        # ✅ Image decode
        img_data = base64.b64decode(image.split(",")[1])
        img_np = np.frombuffer(img_data, np.uint8)
        img = cv2.imdecode(img_np, cv2.IMREAD_COLOR)

        # ✅ Face dhundo
        faces = face_app.get(img)

        if len(faces) == 0:
            return jsonify({
                "verified": False,
                "message": "No face detected!"
            }), 200

        # ✅ Sab registered faces lo DB se
        all_faces = get_all_faces()

        if not all_faces:
            return jsonify({
                "verified": False,
                "message": "No users registered!"
            }), 200

        results = []

        # ✅ Har detected face ko check karo
        for face in faces:
            new_encoding = np.array(face.embedding)

            # Face ka box
            x1, y1, x2, y2 = [int(b) for b in face.bbox]

            best_match_name = "Unknown"
            best_match_role = ""
            best_similarity = 0
            best_user_id = None

            # ✅ DB ke har face se compare karo
            for (user_id, name, role, encoding_str) in all_faces:
                old_encoding = np.array(eval(encoding_str))
                
                # Cosine similarity
                similarity = np.dot(new_encoding, old_encoding) / (
                    np.linalg.norm(new_encoding) * np.linalg.norm(old_encoding)
                )

                if similarity > best_similarity:
                    best_similarity = similarity
                    best_match_name = name
                    best_match_role = role
                    best_user_id = user_id

            # ✅ 50% se zyada match = verified
            if best_similarity > 0.5:
                save_verification_log(best_user_id, best_match_name, "success")
                results.append({
                    "verified": True,
                    "name": best_match_name,
                    "role": best_match_role,
                    "similarity": round(float(best_similarity) * 100, 2),
                    "bbox": [x1, y1, x2, y2],
                    "color": "green"
                })
            else:
                results.append({
                    "verified": False,
                    "name": "Unknown",
                    "role": "",
                    "similarity": 0,
                    "bbox": [x1, y1, x2, y2],
                    "color": "red"
                })

        return jsonify({
            "faces": results
        }), 200

    except Exception as e:
        print(f"[ERROR] ❌ {str(e)}")
        return jsonify({"error": str(e)}), 500