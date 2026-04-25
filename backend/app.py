from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv())

from flask import Flask
from flask_cors import CORS
from routes import verdict_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(verdict_bp)

if __name__ == "__main__":
    app.run(port=5001, debug=True)