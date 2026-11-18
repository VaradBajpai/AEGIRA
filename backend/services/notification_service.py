import os
from pathlib import Path

import requests
from dotenv import load_dotenv


# ==========================================
# LOAD ENVIRONMENT VARIABLES
# ==========================================

BASE_DIR = Path(__file__).resolve().parent.parent

ENV_FILE = BASE_DIR / ".env"

load_dotenv(
    dotenv_path=ENV_FILE,
    override=True
)


TELEGRAM_BOT_TOKEN = os.getenv(
    "TELEGRAM_BOT_TOKEN"
)


# ==========================================
# CHECK CONFIGURATION
# ==========================================

def check_telegram_config():

    if not TELEGRAM_BOT_TOKEN:
        raise ValueError(
            "TELEGRAM_BOT_TOKEN is not configured."
        )


# ==========================================
# SEND TELEGRAM MESSAGE
# ==========================================

def send_telegram_message(
    chat_id,
    user_name,
    latitude,
    longitude,
    trigger_type="manual_sos"
):

    check_telegram_config()


    map_link = (
        "https://www.google.com/maps/search/"
        f"?api=1&query={latitude},{longitude}"
    )


    if trigger_type == "safety_timer_expired":

        reason = (
            "The user's Safety Check-In timer "
            "expired without confirmation."
        )

    else:

        reason = (
            "The user manually activated "
            "the AEGIRA SOS."
        )


    message = (
        "🚨 AEGIRA EMERGENCY ALERT 🚨\n\n"
        f"{user_name} may need assistance.\n\n"
        f"Reason:\n{reason}\n\n"
        "📍 Current location:\n"
        f"{map_link}\n\n"
        "Please try to contact them as soon "
        "as possible.\n\n"
        "This is an automated safety alert "
        "from AEGIRA."
    )


    url = (
        "https://api.telegram.org/"
        f"bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    )


    response = requests.post(
        url,
        json={
            "chat_id": chat_id,
            "text": message,
            "disable_web_page_preview": False
        },
        timeout=15
    )


    data = response.json()


    if not data.get("ok"):

        raise RuntimeError(
            data.get(
                "description",
                "Telegram message failed."
            )
        )


    return data


# ==========================================
# SEND ACTUAL LOCATION PIN
# ==========================================

def send_telegram_location(
    chat_id,
    latitude,
    longitude
):

    check_telegram_config()


    url = (
        "https://api.telegram.org/"
        f"bot{TELEGRAM_BOT_TOKEN}/sendLocation"
    )


    response = requests.post(
        url,
        json={
            "chat_id": chat_id,
            "latitude": float(latitude),
            "longitude": float(longitude)
        },
        timeout=15
    )


    data = response.json()


    if not data.get("ok"):

        raise RuntimeError(
            data.get(
                "description",
                "Telegram location failed."
            )
        )


    return data


# ==========================================
# ALERT ONE TRUSTED CONTACT
# ==========================================

def notify_contact(
    contact,
    user_name,
    latitude,
    longitude,
    trigger_type
):

    contact_name = contact.get(
        "name",
        "Trusted Contact"
    )


    chat_id = (
        contact.get("telegramChatId")
        or
        contact.get("telegram_chat_id")
        or
        contact.get("chat_id")
    )


    result = {
        "contact_name": contact_name,
        "telegram_chat_id": chat_id,
        "message_sent": False,
        "location_sent": False,
        "errors": []
    }


    if not chat_id:

        result["errors"].append(
            "Telegram Chat ID missing."
        )

        return result


    # ======================================
    # SEND MESSAGE
    # ======================================

    try:

        send_telegram_message(
            chat_id=chat_id,
            user_name=user_name,
            latitude=latitude,
            longitude=longitude,
            trigger_type=trigger_type
        )

        result["message_sent"] = True

    except Exception as error:

        print(
            "Telegram message error:",
            error
        )

        result["errors"].append(
            f"Message failed: {error}"
        )


    # ======================================
    # SEND LOCATION PIN
    # ======================================

    try:

        send_telegram_location(
            chat_id=chat_id,
            latitude=latitude,
            longitude=longitude
        )

        result["location_sent"] = True

    except Exception as error:

        print(
            "Telegram location error:",
            error
        )

        result["errors"].append(
            f"Location failed: {error}"
        )


    return result


# ==========================================
# ALERT ALL TRUSTED CONTACTS
# ==========================================

def notify_trusted_contacts(
    contacts,
    user_name,
    latitude,
    longitude,
    trigger_type="manual_sos"
):

    check_telegram_config()


    map_link = (
        "https://www.google.com/maps/search/"
        f"?api=1&query={latitude},{longitude}"
    )


    results = []


    for contact in contacts:

        result = notify_contact(
            contact=contact,
            user_name=user_name,
            latitude=latitude,
            longitude=longitude,
            trigger_type=trigger_type
        )

        results.append(
            result
        )


    return {
        "map_link": map_link,
        "contacts": results
    }