# import flask
import ast
import re
from flask_cors import CORS

from flask import Flask, request, redirect, url_for, session, make_response, flash, render_template, jsonify, json, \
    send_from_directory
# from flask_session import Session
import requests

# import our get connection function
from utils import dbconfig

# set up flask app
app = Flask(__name__, static_url_path='/static', template_folder='templates', static_folder='static')
CORS(app)


# get classes
@app.route('/classes', methods=['GET'])
def get_classes():
    info = ast.literal_eval(requests.get('https://www.dnd5eapi.co/api/classes').content.decode('utf8'))
    return json.dumps(info["results"])


# get class
@app.route('/classes/<class_name>', methods=['GET'])
def get_class(class_name):
    url = 'https://www.dnd5eapi.co/api/classes/' + class_name
    info = ast.literal_eval(requests.get(url).content.decode('utf8'))
    return json.dumps(info)


# get races
@app.route('/races', methods=['GET'])
def get_races():
    info = ast.literal_eval(requests.get('https://www.dnd5eapi.co/api/races').content.decode('utf8'))
    return json.dumps(info["results"])


# get race
@app.route('/races/<race_name>', methods=['GET'])
def get_race(race_name):
    url = 'https://www.dnd5eapi.co/api/races/' + race_name
    info = ast.literal_eval(requests.get(url).content.decode('utf8'))
    return json.dumps(info)


# get trait
@app.route('/traits/<trait_name>', methods=['GET'])
def get_trait(trait_name):
    url = 'https://www.dnd5eapi.co/api/traits/' + trait_name
    info = ast.literal_eval(requests.get(url).content.decode('utf8'))
    return json.dumps(info)


# get features
@app.route('/features', methods=['GET'])
def get_features():
    return requests.get('https://www.dnd5eapi.co/api/features').content


# get feature
@app.route('/features/<feature_name>', methods=['GET'])
def get_feature(feature_name):
    url = 'https://www.dnd5eapi.co/api/features/' + feature_name
    return requests.get(url).content


# get alignments
@app.route('/alignments', methods=['GET'])
def get_alignments():
    info = ast.literal_eval(requests.get('https://www.dnd5eapi.co/api/alignments').content.decode('utf8'))
    return json.dumps(info["results"])


# get alignment
@app.route('/alignments/<alignment_name>', methods=['GET'])
def get_alignment(alignment_name):
    url = 'https://www.dnd5eapi.co/api/alignments/' + alignment_name
    info = ast.literal_eval(requests.get(url).content.decode('utf8'))
    return json.dumps(info)


# get proficiency
@app.route('/proficiencies/<proficiency_name>', methods=['GET'])
def get_proficiency(proficiency_name):
    url = 'https://www.dnd5eapi.co/api/proficiencies/' + proficiency_name
    info = ast.literal_eval(requests.get(url).content.decode('utf8'))
    return json.dumps(info)


# get subraces
@app.route('/subraces', methods=['GET'])
def get_subraces():
    info = ast.literal_eval(requests.get('https://www.dnd5eapi.co/api/subraces').content.decode('utf8'))
    return json.dumps(info["results"])


# get subrace
@app.route('/subraces/<subrace_name>', methods=['GET'])
def get_subrace(subrace_name):
    url = 'https://www.dnd5eapi.co/api/subraces/' + subrace_name
    info = ast.literal_eval(requests.get(url).content.decode('utf8'))
    return json.dumps(info)


@app.route('/newcharacter', methods=['GET'])
def create_character_page():
    return render_template('create_character.html')


@app.route('/newcharacter', methods=['POST'])
def create_character():
    print(request.form)
    charName = request.form['name']
    charRace = request.form['race']
    if 'subrace' in request.form:
        charSubrace = request.form['subrace']
    else:
        charSubrace = None
    extraLangs = None
    charAlignment = request.form['alignment']
    charClass = request.form['class']
    skillProfs = None
    toolProfs = None
    instProfs = None
    for key in request.form:
        if re.search('language*', key):
            extraLangs = str(request.form.getlist(key))
        elif re.search('skill prof*', key):
            skillProfs = str(request.form.getlist(key))
        elif re.search('tool prof*', key):
            toolProfs = str(request.form.getlist(key))
        elif re.search('inst prof*', key):
            instProfs = str(request.form.getlist(key))
    try:
        # set up a new database connection and cursor
        connection = dbconfig.get_connection()
        cursor = connection.cursor()
        # create query string using parameterization to protect against SQL injection
        query = "INSERT INTO ddCharacters VALUES (default, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        # execute our query and commit the changes to the database
        cursor.execute(query, charName, charRace, charSubrace, extraLangs, charAlignment, charClass, skillProfs, toolProfs, instProfs)
        cursor.commit()
    finally:
        # close our database connection
        connection.close()

    return render_template('create_character.html')
    return redirect('http://localhost:5000/newcharacter')


# set up some basic error handlers
@app.errorhandler(404)
def handle_404(e):
    return "404 Not Found: No such resource exists on this server", 404


@app.errorhandler(500)
def handle_500(e):
    return "404 Not Found: No such resource exists on this server", 404


# start our application when main.py is running
if __name__ == '__main__':
    app.secret_key = 'super_secret'
    app.run()
