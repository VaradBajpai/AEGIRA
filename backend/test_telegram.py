import os
from pathlib import Path

import requests
from dotenv import load_dotenv


BASE_DIR = Path(__file__).resolve().parent

load_dotenv(
    dotenv_path=BASE_DIR / ".env",
    override=True
)


BOT_TOKEN = os.getenv(
    "TELEGRAM_BOT_TOKEN"
)


if not BOT_TOKEN:

    print(
        "TELEGRAM_BOT_TOKEN missing."
    )

    raise SystemExit


chat_id = input(
    "Enter your Telegram Chat ID: "
).strip()


# ==========================================
# TEST MESSAGE
# ==========================================

message_url = (
    f"https://api.telegram.org/"
    f"bot{BOT_TOKEN}/sendMessage"
)


message = (
    "🚨 AEGIRA TEST ALERT\n\n"
    "Telegram emergency notifications "
    "are connected successfully.\n\n"
    "The next test will include your "
    "real GPS location."
)


response = requests.post(
    message_url,
    json={
        "chat_id": chat_id,
        "text": message
    },
    timeout=15
)


data = response.json()


if data.get("ok"):

    print()
    print(
        "SUCCESS: Telegram alert sent."
    )

else:

    print()
    print(
        "Telegram error:"
    )

    print(
        data
    )