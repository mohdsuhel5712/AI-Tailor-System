from flask import Flask
from flask import render_template

from backend.api.measurement_api import api_bp


app = Flask(
    __name__,
    template_folder='templates',
    static_folder='static'
)
app.secret_key = "fashshop"

app.register_blueprint(
    api_bp
)


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


if __name__ == "__main__":
    app.run(
        debug=True
    )