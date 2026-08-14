import logging
from urllib.parse import urlencode

from flask import Flask, jsonify, render_template, request

from calculator import CalculatorError, calculate_roi
from market_data.service import get_market_data


logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
app = Flask(__name__)


@app.route("/", methods=["GET", "POST"])
def index():
    """Render the input form and handle ROI calculations."""
    form_data = request.form.to_dict() if request.method == "POST" else request.args.to_dict()

    if request.method == "POST":
        try:
            results = calculate_roi(form_data)
            return render_template("result.html", data=form_data, results=results)
        except CalculatorError as error:
            return render_template("index.html", error=str(error), form_data=form_data), 400

    return render_template("index.html", form_data=form_data)


@app.template_filter("form_query")
def form_query(form_data):
    """Encode submitted form values for the edit-assumptions link."""
    return urlencode(form_data or {})


@app.get("/api/market-data")
def market_data():
    """Return optional market fields without coupling them to ROI calculation."""
    return jsonify(get_market_data(request.args.get("coin", "")))


if __name__ == "__main__":
    app.run(debug=False)
