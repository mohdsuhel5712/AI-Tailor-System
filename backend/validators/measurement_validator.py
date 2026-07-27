"""
=========================================================
File : measurement_validator.py

Folder :
backend/validators/

Purpose
-------
Validate user input before saving to database
=========================================================
"""


def validate_positive(value, name):

    if value <= 0:
        raise ValueError(f"{name} must be positive")

    return True


def validate_gender(gender):

    if gender not in ["Male", "Female"]:
        raise ValueError("Gender must be Male or Female")

    return True


def validate_measurements(data):

    # Required numeric fields

    validate_positive(data["height"], "Height")

    validate_positive(data["weight"], "Weight")

    validate_positive(data["age"], "Age")


    # Gender

    validate_gender(data["category"])


    return True