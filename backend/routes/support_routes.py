from flask import Blueprint, request, jsonify

from services.support_service import (
    get_support_resources,
    get_categories,
    get_cities,
)


support_bp = Blueprint("support", __name__)


@support_bp.route(
    "/api/support",
    methods=["GET"]
)
def support_resources():

    category = request.args.get("category")
    city = request.args.get("city")

    resources = get_support_resources(
        category=category,
        city=city,
    )

    return jsonify({
        "status": "success",
        "count": len(resources),
        "resources": resources,
    }), 200


@support_bp.route(
    "/api/support/options",
    methods=["GET"]
)
def support_options():

    return jsonify({
        "status": "success",
        "categories": get_categories(),
        "cities": get_cities(),
    }), 200