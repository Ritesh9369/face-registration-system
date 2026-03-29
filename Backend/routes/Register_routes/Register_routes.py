from flask import Blueprint
from controllers.Register_controller.Register_controller import register_user

register_bp = Blueprint("register", __name__)
register_bp.route("/api/register", methods=["POST"])(register_user)