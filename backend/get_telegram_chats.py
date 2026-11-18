import os
from pathlib import Path

import requests
from dotenv import load_dotenv


# ==========================================
# LOAD .ENV
# ==========================================

BASE_DIR = Path(__file__).resolve().parent

load_dotenv(
    dotenv_path=BASE_DIR / ".env",
    override=True
)


BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")


# ==========================================
# CHECK TOKEN
# ==========================================

if not BOT_TOKEN:
    print("ERROR: TELEGRAM_BOT_TOKEN is missing from .env")
    raise SystemExit


# ==========================================
# GET RECENT BOT MESSAGES
# ==========================================

url = (
    f"https://api.telegram.org/"
    f"bot{BOT_TOKEN}/getUpdates"
)


try:

    response = requests.get(
        url,
        timeout=15
    )

    response.raise_for_status()

    data = response.json()


    if not data.get("ok"):
        print(
            "Telegram returned an error:",
            data
        )

        raise SystemExit


    updates = data.get(
        "result",
        []
    )


    if not updates:

        print()
        print("No Telegram messages found.")
        print()
        print(
            "Open your AEGIRA bot in Telegram, "
            "press START and send: Hello AEGIRA"
        )

        raise SystemExit


    print()
    print("====================================")
    print(" AEGIRA TELEGRAM CONTACTS")
    print("====================================")
    print()


    found = set()


    for update in updates:

        message = (
            update.get("message")
            or
            update.get("edited_message")
        )


        if not message:
            continue


        chat = message.get(
            "chat",
            {}
        )


        chat_id = chat.get(
            "id"
        )


        if not chat_id:
            continue


        if chat_id in found:
            continue


        found.add(
            chat_id
        )


        first_name = chat.get(
            "first_name",
            ""
        )

        last_name = chat.get(
            "last_name",
            ""
        )

        username = chat.get(
            "username",
            ""
        )


        full_name = (
            f"{first_name} {last_name}"
        ).strip()


        print(
            f"Name: {full_name or 'Unknown'}"
        )

        print(
            f"Username: @{username}"
            if username
            else
            "Username: Not set"
        )

        print(
            f"Chat ID: {chat_id}"
        )

        print(
            "------------------------------------"
        )


except requests.exceptions.RequestException as error:

    print()
    print(
        "Unable to connect to Telegram:"
    )

    print(
        error
    )