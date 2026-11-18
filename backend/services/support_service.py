import csv
from pathlib import Path


DATA_FILE = (
    Path(__file__).resolve().parent.parent
    / "data"
    / "support_resources.csv"
)


def get_support_resources(category=None, city=None):
    resources = []

    with open(DATA_FILE, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)

        for row in reader:
            resources.append(row)

    # Filter by category
    if category:
        resources = [
            resource
            for resource in resources
            if resource["category"].lower()
            == category.lower()
        ]

    # Filter by city
    if city:
        resources = [
            resource
            for resource in resources
            if resource["city"].lower()
            == city.lower()
        ]

    return resources


def get_categories():
    resources = get_support_resources()

    categories = sorted(
        list(
            {
                resource["category"]
                for resource in resources
            }
        )
    )

    return categories


def get_cities():
    resources = get_support_resources()

    cities = sorted(
        list(
            {
                resource["city"]
                for resource in resources
            }
        )
    )

    return cities