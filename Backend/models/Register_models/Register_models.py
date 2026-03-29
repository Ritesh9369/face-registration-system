from config.db import get_db_connection

def save_user(name, email, role, gender):
    conn = get_db_connection()
    cursor = conn.cursor()
    query = "INSERT INTO users (name, email, role, gender) VALUES (%s, %s, %s, %s)"
    cursor.execute(query, (name, email, role, gender))
    conn.commit()
    user_id = cursor.lastrowid
    cursor.close()
    conn.close()
    return user_id

def save_face(user_id, image_path, encoding):
    conn = get_db_connection()
    cursor = conn.cursor()
    query = "INSERT INTO face_data (user_id, image_path, encoding) VALUES (%s, %s, %s)"
    cursor.execute(query, (user_id, image_path, encoding))
    conn.commit()
    cursor.close()
    conn.close()