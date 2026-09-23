from flask import Blueprint,request,jsonify

from backend.alteration.alteration_services import (get_request,
                                                    create_request,
                                                    update_request_status,
                                                    get_all_requests,
                                                    get_status_history,
                                                    get_tailor_requests
                                                    )

alteration_bp=Blueprint("alteration",__name__,url_prefix="/api")

# ============================================================
# CREATE ALTERATION REQUEST
# ============================================================
@alteration_bp.route("/alteration/request",methods=["POST"])
def create_alteration_request():
    try:
        data=request.get_json(silent=True)
        if not data:
            return jsonify({"success":False,"message":"No JSON data received"}),400
        required_fields=["customer_name","phone","garment_type","service_type","pickup_address"]
        missing_fields=[field for field in required_fields if not data.get(field)]
        if missing_fields:
            return jsonify({"success":False,"message":"Missing required fields","fields":missing_fields}),400
        request_id=create_request(data)
        return jsonify({"success":True,"message":"Alteration request created successfully","request_id":request_id}),201
    except Exception as e:
        print("CREATE ALTERATION REQUEST ERROR:",e)
        return jsonify({"success":False,"message":"Failed to create alteration request","error":str(e)}),500
    
# ============================================================
# GET SINGLE ALTERATION REQUEST
# ============================================================

@alteration_bp.route("/alteration-request/<int:request_id>",methods=["GET"])
def get_alteration_request(request_id):
    try:
        data=get_request(request_id)
        if not data:
            return jsonify({"success":False,"message":"Alteration request not found"}),404
        return jsonify({"success":True,"data":data}),200
    except Exception as e:
        print("GET ALTERATION REQUEST ERROR:",e)
        return jsonify({"success":False,"message":"Failed to fetch alteration request","error":str(e)}),500
    
# ============================================================
# UPDATE ALTERATION REQUEST STATUS
# ============================================================

@alteration_bp.route("/alteration-request/<int:request_id>/status",methods=["PUT"])
def update_alteration_request_status(request_id):
    try:
        data=request.get_json(silent=True)
        if not data:
            return jsonify({"success":False,"message":"JSON data not found"}),400
        
        status=data.get("status")
        tailor_name=data.get("tailor_name")
        admin_notes=data.get("admin_notes")
        
        if tailor_name and not status:
            status = "TAILOR_ASSIGNED"
        
        pickup_date = data.get("pickup_date") or None
        pickup_time = data.get("pickup_time") or None
        allowed_status=[
            "REQUESTED",
            "PICKUP_SCHEDULED",
            "PICKED_UP",
            "TAILOR_ASSIGNED",
            "ALTERATION_IN_PROGRESS",
            "QUALITY_CHECK",
            "OUT_FOR_DELIVERY",
            "COMPLETED",
            "CANCELLED"
        ]
        if status not in allowed_status:
            return jsonify({"success":False,"message":"Invalid status","allowed_status":allowed_status}),400
        update_request_status(request_id,status,tailor_name,admin_notes,pickup_date,pickup_time)
        return jsonify({"success":True,"message":"Alteration request updated successfully","request_id":request_id,"status":status}),200
    except Exception as e:
        print("UPDATE ALTERATION STATUS ERROR:",e)
        return jsonify({"success":False,"message":"Failed to update alteration request","error":str(e)}),500
    
# ============================================================
# GET ALL ALTERATION REQUESTS
# ============================================================

@alteration_bp.route("/alteration-requests",methods=["GET"])
def get_all_alteration_request():
    try:
        requests=get_all_requests()
        return jsonify({"success":True,"data":requests}),200
    except Exception as e:
        print("GET ALL ALTERATION REQUEST ERROR:",e)
        return jsonify({"success":False,"message":"Failed to fetch alteration requests","error":str(e)}),500
    
# ===========================
# history api route 
#==========================


@alteration_bp.route("/alteration-request/<int:request_id>/history",methods=['GET'])
def get_alteration_request_history(request_id):
    try:
        history = get_status_history(request_id)
        return jsonify({
            "success":True,
            "request_id":request_id,
            "data":history,
        }),200
    except Exception as e :
        print("get status history error :",e)
        return jsonify({
            "success":False,
            "message":"failed to fetch status history",
            "error":str(e)
        }),500
        
        
        
# ============================================================
# GET TAILOR ASSIGNED REQUESTS
# ============================================================
@alteration_bp.route("/tailor_requests/<string:tailor_name>",methods=['GET'])
def get_tailor_assigned_request(tailor_name):
    try:
        requests = get_tailor_requests(tailor_name)
        return jsonify({
            "success":True,
            "tailor_name":tailor_name,
            "data":requests
        }),200
    except Exception as e:
        print("get tailor request api error:",repr(e))
        return jsonify({
            "success":False,
            "message":"failed to fetch tailor requests",
            "error":str(e)
        }),500
