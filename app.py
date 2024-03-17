import os

from flask import Flask, jsonify
from flask_cors import cross_origin, CORS
from flask import request

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import bcrypt

from dotenv import load_dotenv
load_dotenv()  # This loads the environment variables from .env file.

app = Flask(__name__, static_folder='./build', static_url_path='/')
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

uri = os.environ.get("MONGODB_URI")
print("MongoDB URI: ", uri)
# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))


UserDB = client.Users  
ProjectDB = client.Projects
projects = ProjectDB.project1
users = UserDB.users1

#Login and Signup logic
#
#
@app.route('/process_login', methods=['POST'])
@cross_origin()
def process_login():

    data = request.json
    username = data.get('username')
    password = data.get('password')
    id = data.get('id')

    user = users.find_one({"username": username})
    if user:
        if bcrypt.checkpw(password.encode('utf-8'), user["password"]):
            return jsonify({"username": username, "code": 200}), 200
        else:
            return jsonify({"error": "Invalid login credentials", "code": 401}), 401
    else:
        return jsonify({"error": "User not found", "code": 404}), 404


@app.route('/process_signup', methods=['POST'])
def process_signup():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    id = data.get('id')
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    # Check if user already exists
    if users.find_one({"id": id}):
        return jsonify({"error": "User already exists", "code": 409}), 409

    # Add user to database
    new_user = {"username": username, "password": hashed_password, "id": id}
    users.insert_one(new_user)
    return jsonify({"username": username, "code": 200}), 200

#Project Management Logic
#
#
@app.route('/create_project', methods=['POST'])
def create_project():
    data = request.json
    projectName = data.get('projectName')
    description = data.get('description')
    projectId = data.get('projectId')  # Adjusted to 'projectId' for consistency

    try:
        new_project = {"projectName": projectName, "description": description, "projectId": projectId}
        projects.insert_one(new_project)
        return jsonify({"message": "Project created successfully", "projectId": projectId, "code": 200}), 201
    except Exception as e:
        # Handle any database errors
        return jsonify({"error": str(e), "code": 500}), 500



@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=os.environ.get('PORT', 5000), debug=os.environ.get('DEBUG', 'False') == 'True')