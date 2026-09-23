from backend.database.connection import get_db_connection
# ============================================================
# CREATE ALTERATION REQUEST
# ============================================================
def create_request(data):
    """
    Create a new alteration request and create
    the initial REQUESTED status history.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        query = """
            INSERT INTO alteration_requests (
                customer_name,
                phone,
                category,
                garment_type,
                service_type,
                alteration_type,
                description,
                pickup_address,
                status
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING request_id
        """
        values = (
            data.get("customer_name"),
            data.get("phone"),
            data.get("category"),
            data.get("garment_type"),
            data.get("service_type"),
            data.get("alteration_type"),
            data.get("description"),
            data.get("pickup_address"),
            "REQUESTED"
        )
        print("INSERT DATA:", values)
        cursor.execute(query, values)
        row = cursor.fetchone()
        if not row:
            raise Exception("Request ID was not returned by database")
        request_id = row[0]
        # --------------------------------------------------------
        # CREATE INITIAL STATUS HISTORY
        # --------------------------------------------------------
        history_query = """
            INSERT INTO request_status_history (
                request_id,
                old_status,
                new_status,
                notes
            )
            VALUES (%s, %s, %s, %s)
        """
        history_values = (
            request_id,
            None,
            "REQUESTED",
            "Alteration request created"
        )
        cursor.execute(history_query, history_values)
        # --------------------------------------------------------
        # COMMIT BOTH OPERATIONS
        # --------------------------------------------------------
        conn.commit()
        print("ALTERATION REQUEST CREATED:", request_id)
        print("INITIAL STATUS HISTORY CREATED:", request_id)
        return request_id
    except Exception as e:
        conn.rollback()
        print("DATABASE INSERT ERROR:", repr(e))
        raise
    finally:
        cursor.close()
        conn.close()
# ============================================================
# GET SINGLE ALTERATION REQUEST
# ============================================================
def get_request(request_id):
    """
    Fetch one alteration request by ID.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        query = """
            SELECT
                request_id,
                customer_name,
                phone,
                category,
                garment_type,
                service_type,
                alteration_type,
                description,
                pickup_address,
                preferred_pickup_date,
                preferred_pickup_time,
                tailor_name,
                admin_notes,
                status,
                body_model_path,
                fitting_result,
                created_at
            FROM alteration_requests
            WHERE request_id = %s
        """
        cursor.execute(query, (request_id,))
        row = cursor.fetchone()
        if not row:
            return None
        columns = [desc[0] for desc in cursor.description]
        return dict(zip(columns, row))
    finally:
        cursor.close()
        conn.close()
# ============================================================
# GET ALL ALTERATION REQUESTS
# ============================================================
def get_all_requests():
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        query = """
            SELECT
                request_id,
                customer_name,
                phone,
                category,
                garment_type,
                service_type,
                alteration_type,
                description,
                pickup_address,
                tailor_name,
                admin_notes,
                status,
                created_at
            FROM alteration_requests
            ORDER BY request_id DESC
        """
        cursor.execute(query)
        rows = cursor.fetchall()
        columns = [desc[0] for desc in cursor.description]
        requests = [
            dict(zip(columns, row))
            for row in rows
        ]
        return requests
    except Exception as e:
        print("GET ALL THE REQUEST ERROR:", repr(e))
        raise
    finally:
        cursor.close()
        conn.close()
# ============================================================
# UPDATE ALTERATION REQUEST STATUS
# ============================================================
def update_request_status(
    request_id,
    status,
    tailor_name=None,
    admin_notes=None,
    pickup_date = None,
    pickup_time = None
):
    """
    Update alteration request status and create
    a corresponding status history record.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # --------------------------------------------------------
        # STEP 1: GET CURRENT STATUS
        # --------------------------------------------------------
        current_status_query = """
            SELECT status
            FROM alteration_requests
            WHERE request_id = %s
            FOR UPDATE
        """
        cursor.execute(
            current_status_query,
            (request_id,)
        )
        row = cursor.fetchone()
        if not row:
            raise Exception(
                f"Alteration request {request_id} not found"
            )
        old_status = row[0]
        print(
            f"CURRENT STATUS: {old_status} "
            f"-> NEW STATUS: {status}"
        )
        # --------------------------------------------------------
        # STEP 2: UPDATE ALTERATION REQUEST
        # --------------------------------------------------------
        update_query = """
            UPDATE alteration_requests
            SET
                status = %s,
                tailor_name = %s,
                admin_notes = %s,
                preferred_pickup_date= %s,
                preferred_pickup_time = %s,
                updated_at = CURRENT_TIMESTAMP
            WHERE request_id = %s
            RETURNING request_id
        """
        cursor.execute(
            update_query,
            (
                status,
                tailor_name,
                admin_notes,
                pickup_date,
                pickup_time,
                request_id
            )
        )
        updated_row = cursor.fetchone()
        if not updated_row:
            raise Exception(
                f"Alteration request {request_id} could not be updated"
            )
        # --------------------------------------------------------
        # STEP 3: CREATE STATUS HISTORY
        # --------------------------------------------------------
        if old_status != status:
            history_query = """
                INSERT INTO request_status_history (
                    request_id,
                    old_status,
                    new_status,
                    notes
                )
                VALUES (%s, %s, %s, %s)
            """
            history_values = (
                request_id,
                old_status,
                status,
                admin_notes
            )
            cursor.execute(
                history_query,
                history_values
            )
            print(
                f"STATUS HISTORY CREATED: "
                f"{old_status} -> {status}"
            )
        else:
            print(
                "STATUS DID NOT CHANGE. "
                "No new history record created."
            )
        # --------------------------------------------------------
        # STEP 4: COMMIT
        # --------------------------------------------------------
        conn.commit()
        print(
            f"ALTERATION REQUEST {request_id} "
            f"UPDATED: {status}"
        )
        return updated_row[0]
    except Exception as e:
        conn.rollback()
        print(
            "DATABASE UPDATE ERROR:",
            repr(e)
        )
        raise
    finally:
        cursor.close()
        conn.close()
# ============================================================
# GET STATUS HISTORY
# ============================================================
def get_status_history(request_id):
    """
    Fetch complete status history for an alteration request.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        query = """
            SELECT
                history_id,
                request_id,
                old_status,
                new_status,
                notes,
                updated_by,
                created_at
            FROM request_status_history
            WHERE request_id = %s
            ORDER BY history_id ASC
        """
        cursor.execute(
            query,
            (request_id,)
        )
        rows = cursor.fetchall()
        columns = [
            desc[0]
            for desc in cursor.description
        ]
        history = [
            dict(zip(columns, row))
            for row in rows
        ]
        return history
    except Exception as e:
        print(
            "GET STATUS HISTORY ERROR:",
            repr(e)
        )
        raise
    finally:
        cursor.close()
        conn.close()


# GET_TAILOR_DASHBOARD
# ============================================================
# GET REQUESTS ASSIGNED TO A TAILOR
# ============================================================
def get_tailor_requests(tailor_name):

    conn = get_db_connection()
    cursor = conn.cursor()

    try:

        query = """
            SELECT
                request_id,
                customer_name,
                phone,
                category,
                garment_type,
                service_type,
                alteration_type,
                description,
                pickup_address,
                preferred_pickup_date,
                preferred_pickup_time,
                tailor_name,
                status,
                admin_notes,
                created_at,
                updated_at
            FROM alteration_requests
            WHERE tailor_name = %s
            ORDER BY request_id DESC
        """

        cursor.execute(query, (tailor_name,))

        rows = cursor.fetchall()

        columns = [
            desc[0]
            for desc in cursor.description
        ]

        requests = [
            dict(zip(columns, row))
            for row in rows
        ]

        return requests

    except Exception as e:

        print(
            "GET TAILOR REQUEST ERROR:",
            repr(e)
        )

        raise

    finally:

        cursor.close()
        conn.close()