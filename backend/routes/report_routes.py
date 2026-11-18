from flask import Blueprint, request, jsonify

from services.nlp_service import structure_incident_report


report_bp = Blueprint("reports", __name__)


@report_bp.route("/api/report/structure", methods=["POST"])
def structure_report():

    data = request.get_json(silent=True) or {}

    description = data.get("description", "").strip()

    if not description:
        return jsonify({
            "status": "error",
            "message": "Incident description is required."
        }), 400

    report = structure_incident_report(description)

    return jsonify({
        "status": "success",
        "message": "Private incident report structured successfully.",
        "report": report
    }), 200