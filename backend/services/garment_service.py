# =====================================================
# garment_service.py
# Garment Database Service
# =====================================================

from backend.database.connection import get_db_connection


def get_all_garments():
    connection=None
    cursor=None

    try:
        connection=get_db_connection()

        cursor=connection.cursor()

        query="""
        SELECT
            garment_id,
            category_id,
            garment_name,
            obj_file,
            texture_file,
            size
        FROM garments
        ORDER BY garment_id;
        """

        cursor.execute(query)

        rows=cursor.fetchall()

        garments=[]

        for row in rows:
            garment={
                "garment_id":row[0],
                "category_id":row[1],
                "garment_name":row[2],
                "obj_file":row[3],
                "texture_file":row[4],
                "size":row[5]
            }

            garments.append(garment)

        return garments

    except Exception as error:
        print(
            "❌ Garment database error:",
            error
        )

        return []

    finally:
        if cursor:
            cursor.close()

        if connection:
            connection.close()


def get_garment_by_id(garment_id):
    connection=None
    cursor=None

    try:
        connection=get_db_connection()

        cursor=connection.cursor()

        query="""
        SELECT
            garment_id,
            category_id,
            garment_name,
            obj_file,
            texture_file,
            size
        FROM garments
        WHERE garment_id=%s;
        """

        cursor.execute(
            query,
            (garment_id,)
        )

        row=cursor.fetchone()

        if row is None:
            return None

      
        garment={
            "garment_id":row[0],
            "category_id":row[1],
            "garment_name":row[2],
            "obj_file":row[3],
            "texture_file":row[4],
            "size":row[5]
        }

        return garment

    except Exception as error:
        print(
            "❌ Garment database error:",
            error
        )

        return None

    finally:
        if cursor:
            cursor.close()

        if connection:
            connection.close()


def get_garments_by_category(category_id):
    connection=None
    cursor=None

    try:
        connection=get_db_connection()

        cursor=connection.cursor()

        query="""
        SELECT
            garment_id,
            category_id,
            garment_name,
            obj_file,
            texture_file,
            size
        FROM garments
        WHERE category_id=%s
        ORDER BY garment_id;
        """

        cursor.execute(
            query,
            (category_id,)
        )

        rows=cursor.fetchall()

        garments=[]

        for row in rows:
            garment={
                "garment_id":row[0],
                "category_id":row[1],
                "garment_name":row[2],
                "obj_file":row[3],
                "texture_file":row[4],
                "size":row[5]
            }

            garments.append(garment)

        return garments

    except Exception as error:
        print(
            "❌ Category garment error:",
            error
        )

        return []

    finally:
        if cursor:
            cursor.close()

        if connection:
            connection.close()