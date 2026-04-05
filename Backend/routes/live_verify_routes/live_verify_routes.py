from flask import Blueprint
from controllers.live_verify_controller.live_verify_controller import live_verify

live_verify_bp = Blueprint("live_verify", __name__)
live_verify_bp.route("/api/live-verify", methods=["POST"])(live_verify)