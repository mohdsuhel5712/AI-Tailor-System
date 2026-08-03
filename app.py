from flask import Flask,request,redirect,render_template
from flask import render_template

# api measurements
from backend.api.measurement_api import api_bp
# import for prediction
from backend.api.body_prediction_api import body_prediction_bp
# for texture 
from backend.api.texture_api import texture_bp
from backend.api.garment_api import garment_bp



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


@app.route('/measurement')
def measurement():
    return render_template(
        'measurement_form.html'
    )


@app.route('/profile')
def profile():
    return render_template(
        'profile.html'
    )

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

if __name__ == "__main__":
    app.run(
        debug=True
    )