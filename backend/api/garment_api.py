# =====================================================
# garment_api.py
# Garment Flask API
# =====================================================

from flask import Blueprint ,jsonify
from backend.services.garment_service import get_all_garments,get_garments_by_category,get_garment_by_id

garment_bp = Blueprint("garment_bp",__name__,url_prefix="/api")
# =====================================================
# GET ALL GARMENTS
# URL:
# http://127.0.0.1:5000/api/garments
# =====================================================
@garment_bp.route('/garments',methods=['GET'])
def get_garments():
      garments = get_all_garments()
      return jsonify({
            "success":True,
            "count":len(garments),
            "garments":garments
      })
      
# =====================================================
# GET GARMENT BY ID
# URL:
# http://127.0.0.1:5000/api/garments/1
# =====================================================

@garment_bp.route("/garments/<int:garment_id>",methods=['GET'])
def get_single_garmen(garment_id):
      garment = get_garment_by_id(garment_id)
      if garment in None:
            return jsonify({
                  "success":False,
                  "message":"garment not found"
            }),404
      return jsonify({
            "succes":True,
            "garment":garment
      })
      
# =====================================================
# GET GARMENTS BY CATEGORY
# CATEGORY:
# 1 = SHIRT
# 2 = PANT
#
# URL:
# /api/garments/category/1
# /api/garments/category/2
# =====================================================

@garment_bp.route("/garments/<int:category_id>",methods=['GET'])
def get_category_garments(category_id):
      garments = get_garments_by_category(category_id)
      return  jsonify({
            "success":True,
            "category_id":category_id,
            "count":len(garments),
            "garments":garments
      })