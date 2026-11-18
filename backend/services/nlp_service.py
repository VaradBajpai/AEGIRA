import re


def structure_incident_report(text):
    text_lower = text.lower()

    report = {
        "incident_type": "Safety Concern",
        "date": "Not specified",
        "time": "Not specified",
        "location": "Not specified",
        "actions_taken": [],
        "evidence": "Not specified",
        "support_needed": "Not specified",
        "original_description": text
    }

    # -----------------------------
    # INCIDENT TYPE
    # -----------------------------

    incident_keywords = {
        "Following / Stalking Concern": [
            "followed",
            "following",
            "stalking",
            "stalked"
        ],

        "Harassment Concern": [
            "harassed",
            "harassment",
            "commented",
            "catcalled"
        ],

        "Physical Safety Concern": [
            "attacked",
            "hit",
            "grabbed",
            "pushed",
            "assaulted"
        ],

        "Threat / Intimidation": [
            "threatened",
            "threat",
            "intimidated"
        ],

        "Workplace Safety Concern": [
            "office",
            "workplace",
            "manager",
            "coworker",
            "colleague"
        ]
    }

    for incident_type, keywords in incident_keywords.items():
        for keyword in keywords:
            if keyword in text_lower:
                report["incident_type"] = incident_type
                break

        if report["incident_type"] == incident_type:
            break

    # -----------------------------
    # TIME EXTRACTION
    # -----------------------------

    time_pattern = r"\b(?:around\s+|at\s+)?(\d{1,2}(?::\d{2})?\s?(?:am|pm|AM|PM))\b"

    time_match = re.search(time_pattern, text)

    if time_match:
        report["time"] = time_match.group(1)

    # -----------------------------
    # DATE WORDS
    # -----------------------------

    if "yesterday" in text_lower:
        report["date"] = "Yesterday"

    elif "today" in text_lower:
        report["date"] = "Today"

    elif "last night" in text_lower:
        report["date"] = "Last night"

    # -----------------------------
    # LOCATION DETECTION
    # -----------------------------

    location_keywords = [
        "metro station",
        "bus stop",
        "college",
        "school",
        "office",
        "market",
        "street",
        "parking",
        "mall",
        "station",
        "park",
        "hostel"
    ]

    detected_locations = []

    for location in location_keywords:
        if location in text_lower:
            detected_locations.append(location.title())

    if detected_locations:
        report["location"] = ", ".join(detected_locations)

    # -----------------------------
    # ACTIONS TAKEN
    # -----------------------------

    action_keywords = {
        "Called a trusted person": [
            "called my friend",
            "called my mother",
            "called my father",
            "called my mom",
            "called my dad"
        ],

        "Moved to a public place": [
            "entered a shop",
            "went into a shop",
            "entered a store",
            "went to a public place"
        ],

        "Asked someone for help": [
            "asked for help",
            "requested help"
        ],

        "Contacted security": [
            "called security",
            "contacted security"
        ]
    }

    for action, keywords in action_keywords.items():
        for keyword in keywords:
            if keyword in text_lower:
                report["actions_taken"].append(action)
                break

    if not report["actions_taken"]:
        report["actions_taken"] = ["Not specified"]

    # -----------------------------
    # EVIDENCE
    # -----------------------------

    evidence_words = [
        "photo",
        "video",
        "screenshot",
        "recording",
        "message",
        "camera",
        "cctv"
    ]

    detected_evidence = []

    for word in evidence_words:
        if word in text_lower:
            detected_evidence.append(word.title())

    if detected_evidence:
        report["evidence"] = ", ".join(detected_evidence)

    # -----------------------------
    # SUPPORT NEEDED
    # -----------------------------

    if "counsel" in text_lower:
        report["support_needed"] = "Counseling"

    elif "legal" in text_lower or "lawyer" in text_lower:
        report["support_needed"] = "Legal Aid"

    elif "medical" in text_lower or "hospital" in text_lower:
        report["support_needed"] = "Medical Assistance"

    elif "shelter" in text_lower:
        report["support_needed"] = "Shelter / Safe Accommodation"

    elif "police" in text_lower:
        report["support_needed"] = "Emergency / Police Information"

    return report