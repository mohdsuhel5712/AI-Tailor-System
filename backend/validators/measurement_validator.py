'''backend/validator/measurement_validator.py '''
'''STEP 3 — Create Validation Module'''


def validate_positive(value, name):

    if value <= 0:
        raise ValueError(
            f"{name} must be positive"
        )

    return True


def validate_measurements(data):

    validate_positive(
        data['height'],
        'height'
    )

    validate_positive(
        data['chest'],
        'chest'
    )

    validate_positive(
        data['waist'],
        'waist'
    )

    validate_positive(
        data['hip'],
        'hip'
    )

    validate_positive(
        data['shoulder'],
        'shoulder'
    )

    validate_positive(
        data['arm_length'],
        'arm_length'
    )

    validate_positive(
        data['leg_length'],
        'leg_length'
    )

    return True