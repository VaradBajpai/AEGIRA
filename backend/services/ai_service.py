import os
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types


BASE_DIR = Path(__file__).resolve().parent.parent
ENV_FILE = BASE_DIR / ".env"

# Force values from backend/.env to be used
load_dotenv(
    dotenv_path=ENV_FILE,
    override=True
)

API_KEY = os.getenv("AI_API_KEY")

MODEL = os.getenv(
    "GEMINI_MODEL",
    "gemini-3.7-flash"
)


SYSTEM_INSTRUCTIONS = """
You are AEGIRA AI, the conversational assistant inside
AEGIRA, a women's safety and support application.

Provide calm, concise, practical and privacy-conscious
assistance related to personal safety, incident
documentation and support resources.

Important rules:

- Never claim AEGIRA guarantees someone's safety.
- Never claim emergency services have been contacted unless
  the actual AEGIRA system confirms it.
- Never claim an SOS was delivered unless AEGIRA confirms it.
- Do not determine whether an allegation is true or false.
- Do not invent missing information.
- Do not provide definitive medical or legal conclusions.
- Do not encourage confrontation with a potentially dangerous
  person.
- Respect privacy and avoid unnecessary identifying details.
- Keep urgent safety answers short and practical.

AEGIRA features include:
SOS, Trusted Circle, Safety Check-In, Private Report,
Find Support, and Voice Assistant.

AEGIRA does not replace official emergency services.
"""


def build_conversation(message, history):
    conversation = ""

    for item in history[-6:]:
        role = item.get("role", "user")
        content = item.get("content", "")

        if not content:
            continue

        if role == "assistant":
            conversation += f"AEGIRA: {content}\n"
        else:
            conversation += f"User: {content}\n"

    conversation += f"\nUser: {message}\nAEGIRA:"

    return conversation


def ask_aegira_ai(message, history=None):
    if not API_KEY:
        raise ValueError(
            "GEMINI_API_KEY is not configured."
        )

    history = history or []

    client = genai.Client(
        api_key=API_KEY
    )

    conversation = build_conversation(
        message,
        history
    )

    response = client.models.generate_content(
        model=MODEL,
        contents=conversation,
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_INSTRUCTIONS,
            temperature=0.4,
            max_output_tokens=500,
        ),
    )

    if not response.text:
        return (
            "I could not generate a response. "
            "Please try again."
        )

    return response.text.strip()