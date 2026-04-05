import cv2
import numpy as np
import base64
from flask import request, jsonify
from insightface.app import FaceAnalysis
from models.verify_models.verify_models import get_all_faces, save_verification_log

face_app = FaceAnalysis()
face_app.prepare(ctx_id=0)

def is_real_face(img, face):
    # ✅ Blur Check
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blur_score = cv2.Laplacian(gray, cv2.CV_64F).var()
    if blur_score < 30:
        return False, "Image too blurry!"

    # ✅ Face Size Check
    face_area = (face.bbox[2] - face.bbox[0]) * (face.bbox[3] - face.bbox[1])
    img_area = img.shape[0] * img.shape[1]
    if (face_area / img_area) < 0.08:
        return False, "Please come closer to camera!"

    # ✅ Texture Check
    x1,y1,x2,y2 = int(face.bbox[0]),int(face.bbox[1]),int(face.bbox[2]),int(face.bbox[3])
    face_crop = gray[y1:y2, x1:x2]
    if face_crop.size == 0:
        return False, "Face crop failed!"
    if cv2.Laplacian(face_crop, cv2.CV_64F).var() < 20:
        return False, "Printed photo detected!"

    return True, "Real face!"

def verify_user():
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
            return jsonify({"verified": False, "message": "No face detected!"}), 200

        face = faces[0]

        # ✅ Real face check
        is_real, message = is_real_face(img, face)
        if not is_real:
            return jsonify({"verified": False, "message": message}), 200

        # ✅ Encoding lo
        new_encoding = np.array(face.embedding)

        # ✅ DB se saare faces lo
        all_faces = get_all_faces()
        if not all_faces:
            return jsonify({"verified": False, "message": "No users registered!"}), 200

        best_name = "Unknown"
        best_role = ""
        best_similarity = 0
        best_user_id = None

        # ✅ Compare karo
        for (user_id, name, role, encoding_str) in all_faces:
            old_encoding = np.array(eval(encoding_str))
            similarity = np.dot(new_encoding, old_encoding) / (
                np.linalg.norm(new_encoding) * np.linalg.norm(old_encoding)
            )
            if similarity > best_similarity:
                best_similarity = similarity
                best_name = name
                best_role = role
                best_user_id = user_id

        # ✅ Result
        if best_similarity > 0.5:
            save_verification_log(best_user_id, best_name, "success")
            return jsonify({
                "verified": True,
                "name": best_name,
                "role": best_role,
                "similarity": round(float(best_similarity) * 100, 2),
                "message": f"Welcome {best_name}! ✅"
            }), 200
        else:
            save_verification_log(None, "Unknown", "failed")
            return jsonify({
                "verified": False,
                "name": "Unknown",
                "message": "Face not recognized! ❌"
            }), 200

    except Exception as e:
        print(f"[ERROR] ❌ {str(e)}")
        return jsonify({"error": str(e)}), 500