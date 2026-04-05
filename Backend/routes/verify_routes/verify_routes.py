from flask import Blueprint
from controllers.verify_controller.verify_controller import verify_user

verify_bp = Blueprint("verify", __name__)
verify_bp.route("/api/verify", methods=["POST"])(verify_user)