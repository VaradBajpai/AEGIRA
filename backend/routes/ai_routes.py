from flask import Blueprint, jsonify, request

from services.ai_service import ask_aegira_ai


ai_bp = Blueprint(
    "ai",
    __name__
)


@ai_bp.route(
    "/api/ai/chat",
    methods=["POST"]
)
def ai_chat():

    data = request.get_json(silent=True) or {}

    message = data.get(
        "message",
        ""
    ).strip()

    history = data.get(
        "history",
        []
    )

    if not message:
        return jsonify({
            "status": "error",
            "message": "A message is required."
        }), 400

    try:

        answer = ask_aegira_ai(
            message=message,
            history=history
        )

        return jsonify({
            "status": "success",
            "answer": answer
        }), 200

    except ValueError as error:

        print(
            "AEGIRA Configuration Error:",
            error
        )

        return jsonify({
            "status": "error",
            "message": str(error)
        }), 500

    except Exception as error:

        print(
            "AEGIRA Gemini Error:",
            error
        )

        return jsonify({
            "status": "error",
            "message": "AEGIRA AI is temporarily unavailable."
        }), 500