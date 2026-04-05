from config.db import get_db_connection

def get_all_faces():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT u.id, u.name, u.role, fd.encoding 
        FROM users u 
        JOIN face_data fd ON u.id = fd.user_id
    """)
    faces = cursor.fetchall()
    cursor.close()
    conn.close()
    return faces

def save_verification_log(user_id, name, status):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO verification_logs (user_id, name, status) VALUES (%s, %s, %s)",
        (user_id, name, status)
    )
    conn.commit()
    cursor.close()
    conn.close()