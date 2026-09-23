from flask import Flask,request,redirect,render_template
from flask import render_template,flash,url_for
# api measurements
from backend.api.measurement_api import api_bp
# import for prediction
from backend.api.body_prediction_api import body_prediction_bp
# for texture 
from backend.api.texture_api import texture_bp
from backend.api.garment_api import garment_bp
from backend.alteration.alteration_api import alteration_bp
from backend.alteration.alteration_services import update_request_status,get_request,get_all_requests

app = Flask(
    __name__,
    template_folder='templates',
    static_folder='static'
)
app.secret_key = "fashshop"
app.register_blueprint(api_bp)
app.register_blueprint(body_prediction_bp)
app.register_blueprint(texture_bp)
app.register_blueprint(garment_bp)
app.register_blueprint(alteration_bp)
@app.route('/')
def index():
    return render_template(
        'index.html'
    )
@app.route('/dashboard')
def dashboard():
    return render_template(
        'dashboard.html'
    )
# cutomer tracking 
@app.route("/customer-tracking")
def customer_tracking():
    return render_template("customer_tracking.html")
@app.route('/measurement')
def measurement():
    return render_template(
        'measurement_form.html'
    )
# request details
@app.route("/request-detail")
def request_detail():
    return render_template("request_detail.html")
@app.route('/profile')
def profile():
    return render_template(
        'profile.html'
    )
# ==============
# tailor request 
# ===========
@app.route("/tailor_dashboard")
def tailor_dashboard():
    return render_template('tailor_dashboard.html')
# PRINT/SAVE PDF = REQUEST DATA
@app.route("/print-request") 
def print_request(): 
    return render_template("print_request.html")


# =========================
# quality check route 
# =====================
@app.route("/quality_check/<int:request_id>", methods=["GET", "POST"])
def quality_check(request_id):

    request_data = get_request(request_id)

    if not request_data:
        return "Alteration request not found", 404

    if request.method == "POST":

        quality_notes = request.form.get(
            "quality_notes",
            ""
        ).strip()

        if not quality_notes:

            flash(
                "Please enter quality check notes before approval.",
                "warning"
            )

            return render_template(
                "quality_check.html",
                request_data=request_data
            )

        try:

            update_request_status(
                request_id=request_id,
                status="OUT_FOR_DELIVERY",
                tailor_name=request_data.get("tailor_name"),
                admin_notes=quality_notes
            )

            flash(
                f"Request #{request_id} passed quality check "
                "and is now ready for delivery.",
                "success"
            )

            return redirect(
                url_for(
                    "quality_check",
                    request_id=request_id
                )
            )

        except Exception as e:

            print(
                "QUALITY CHECK ERROR:",
                repr(e)
            )

            flash(
                "Unable to update the quality status.",
                "danger"
            )

    return render_template(
        "quality_check.html",
        request_data=request_data
    )

# =================
# delivery management
# ====================
@app.route("/delivery-management")
def delivery_management():
    requests = get_all_requests()

    delivery_requests = [
        req for req in requests
        if req.get("status") == "OUT_FOR_DELIVERY"
    ]

    return render_template(
        "delivery_management.html",
        delivery_requests=delivery_requests
    )
    
    
@app.route("/delivery-management/<int:request_id>/complete", methods=["POST"])
def complete_delivery(request_id):

    request_data = get_request(request_id)

    if not request_data:
        return "Alteration request not found", 404

    if request_data.get("status") != "OUT_FOR_DELIVERY":
        flash(
            "This request is not currently out for delivery.",
            "warning"
        )
        return redirect(url_for("delivery_management"))

    try:
        update_request_status(
            request_id=request_id,
            status="COMPLETED",
            tailor_name=request_data.get("tailor_name"),
            admin_notes=request_data.get("admin_notes")
        )

        flash(
            f"Request #{request_id} has been marked as delivered.",
            "success"
        )

    except Exception as e:
        print("DELIVERY COMPLETION ERROR:", repr(e))

        flash(
            "Unable to complete delivery.",
            "danger"
        )

    return redirect(url_for("delivery_management"))



# ===================
# BODY PREDICTION ROUTES
# ==================
@app.route("/body-predict")
def body_predict():
    return render_template('prediction_result.html')
@app.route("/body_result")
def body_result():
    return render_template('prediction_result.html')
@app.route('/body-viewer',methods=['GET','POST'])
def body_viewer():
    # if request.method == 'POST':
        # height = int(request.form(['height']))
        # weight = int(request.form(['weight']))
        # age = int(request.form(['age']))
        # chest = int(request.form(['chest']))
    return render_template("body_viewer.html")
# alteration services 
@app.route("/alteration_request")
def alteration_request():
    return render_template("alteration_request.html")
if __name__ == "__main__":
    app.run(
        debug=True
    )
print(app.url_map)