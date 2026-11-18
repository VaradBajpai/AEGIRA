from datetime import datetime

from flask import (
    Blueprint,
    jsonify,
    request
)

from services.notification_service import (
    notify_trusted_contacts
)


alert_bp = Blueprint(
    "alerts",
    __name__
)


# ==========================================
# SOS ALERT
# ==========================================

@alert_bp.route(
    "/api/alerts/demo",
    methods=["POST"]
)
def send_sos_alert():

    data = (
        request.get_json(
            silent=True
        )
        or {}
    )


    user_name = data.get(
        "name",
        "AEGIRA User"
    )


    latitude = data.get(
        "latitude"
    )


    longitude = data.get(
        "longitude"
    )


    contacts = data.get(
        "contacts",
        []
    )


    trigger_type = data.get(
        "trigger_type",
        "manual_sos"
    )


    # ======================================
    # CHECK LOCATION
    # ======================================

    if (
        latitude is None
        or longitude is None
    ):

        return jsonify({
            "status": "error",
            "message":
                "Location is required."
        }), 400


    # ======================================
    # CHECK CONTACTS
    # ======================================

    if not contacts:

        return jsonify({
            "status": "error",
            "message":
                "Add at least one trusted contact."
        }), 400


    try:

        notification_result = (
            notify_trusted_contacts(
                contacts=contacts,
                user_name=user_name,
                latitude=latitude,
                longitude=longitude,
                trigger_type=trigger_type
            )
        )


        successful_messages = 0

        successful_locations = 0


        for result in (
            notification_result[
                "contacts"
            ]
        ):

            if result.get(
                "message_sent"
            ):
                successful_messages += 1


            if result.get(
                "location_sent"
            ):
                successful_locations += 1


        return jsonify({

            "status":
                "success",

            "message":
                "AEGIRA emergency alert processed.",

            "alert": {

                "alert_type":
                    "SOS",

                "trigger_type":
                    trigger_type,

                "delivery_method":
                    "Telegram",

                "latitude":
                    latitude,

                "longitude":
                    longitude,

                "map_link":
                    notification_result[
                        "map_link"
                    ],

                "timestamp":
                    datetime.now()
                    .isoformat(),

                "messages_sent":
                    successful_messages,

                "locations_sent":
                    successful_locations,

                "trusted_contacts":
                    notification_result[
                        "contacts"
                    ]
            }

        }), 200


    except ValueError as error:

        print(
            "AEGIRA configuration error:",
            error
        )


        return jsonify({

            "status":
                "error",

            "message":
                str(error)

        }), 500


    except Exception as error:

        print(
            "AEGIRA alert error:",
            error
        )


        return jsonify({

            "status":
                "error",

            "message":
                "Unable to send AEGIRA emergency alert."

        }), 500