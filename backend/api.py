from flask import Flask, jsonify, request, Response
from flask_cors import CORS
import datetime as dt
import json

app = Flask(__name__)
CORS(app)

@app.route('/api/vehicle-trends', methods=['GET'])
def vehicle_trends():
    data = {
        "diesel": [90000, 88000, 86000, 84000, 82000],
        "ev": [15000, 28000, 47000, 72000, 110000],
        "hybrid": [20000, 30000, 42000, 54000, 68000],
        "petrol": [120000, 125000, 130500, 135000, 138000],
        "years": [2025, 2026, 2027, 2028, 2029]
    }
    return Response(json.dumps(data, indent=2), mimetype='application/json')

@app.route('/api/traffic-forecast', methods=['GET'])
def traffic_forecast():
    data = {
        "days": ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
        "congestion_index": [55, 60, 58, 63, 59, 57, 61]
    }
    return Response(json.dumps(data, indent=2), mimetype='application/json')

@app.route('/api/pollution-forecast', methods=['GET'])
def pollution_forecast():
    data = {
        "days": ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
        "pm25": [75, 82, 90, 68, 60, 55, 70],
        "pm10": [120, 140, 150, 110, 100, 95, 105]
    }
    return Response(json.dumps(data, indent=2), mimetype='application/json')

@app.route('/api/upload-historical', methods=['POST'])
def upload_historical():
    return jsonify({ 'status': 'ok', 'received_at': dt.datetime.utcnow().isoformat() + 'Z', 'note': 'Upload endpoint placeholder' })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
