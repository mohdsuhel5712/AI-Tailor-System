'''STEP 4 — Create Measurement Service'''
'''FASH_SHOP/backend/services/measurement_service.py'''

from backend.database.connection import get_db_connection


def save_measurements(data):

    conn = get_db_connection()

    cursor = conn.cursor()

    query = """
        INSERT INTO body_measurements
        (
            height,
            chest,
            waist,
            hip,
            shoulder,
            arm_length,
            leg_length,
            gender,
            body_shape,
            mesh_file
        )

        VALUES
        (
            %s,%s,%s,%s,%s,
            %s,%s,%s,%s,%s
        )
    """

    cursor.execute(

        query,

        (
            data['height'],
            data['chest'],
            data['waist'],
            data['hip'],
            data['shoulder'],
            data['arm_length'],
            data['leg_length'],
            data['gender'],
            data['body_shape'],
            data['mesh_file']
        )
    )

    conn.commit()

    cursor.close()

    conn.close()

    return True


def get_measurement():

    conn = get_db_connection()

    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM body_measurements"
    )

    data = cursor.fetchall()

    cursor.close()

    conn.close()

    return data