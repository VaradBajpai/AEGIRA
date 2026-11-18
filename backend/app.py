from flask import Flask, jsonify
from flask_cors import CORS

from routes.alert_routes import alert_bp
from routes.report_routes import report_bp
from routes.support_routes import support_bp
from routes.ai_routes import ai_bp


# ==========================================
# CREATE FLASK APP
# ==========================================

app = Flask(__name__)


# ==========================================
# ENABLE CORS
# ==========================================

CORS(app)


# ==========================================
# REGISTER ROUTES
# ==========================================

app.register_blueprint(alert_bp)
app.register_blueprint(report_bp)
app.register_blueprint(support_bp)
app.register_blueprint(ai_bp)


# ==========================================
# HOME ROUTE
# ==========================================

@app.route("/")
def home():

    return jsonify({
        "app": "AEGIRA",
        "message": "AEGIRA Backend is running",
        "status": "success"
    })


# ==========================================
# HEALTH CHECK
# ==========================================

@app.route("/api/health")
def health():

    return jsonify({
        "app": "AEGIRA",
        "backend": "Flask",
        "ai": "Gemini",
        "alerts": "Enabled",
        "status": "healthy"
    })


# ==========================================
# RUN SERVER
# ==========================================

if __name__ == "__main__":

    app.run(
        debug=True,
        port=5000
    )