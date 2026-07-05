from backend.database.connection import get_db_connection

fabrics = [
    ("Cotton", 0.7, 0.2, 0.5),
    ("Denim", 0.9, 0.1, 0.8),
    ("Linen", 0.6, 0.3, 0.4),
    ("Silk", 0.2, 0.8, 0.1)
]

conn = get_db_connection()
cursor = conn.cursor()

for fabric in fabrics:
    cursor.execute(
        '''
        INSERT INTO fabrics
        (fabric_name, roughness, reflectance, wrinkle_factor)
        VALUES (%s, %s, %s, %s)
        ''',
        fabric
    )

conn.commit()

cursor.close()
conn.close()

print("Data inserted successfully")
