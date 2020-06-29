from flask import Flask, request, jsonify
from testmodelpy import mainmodel
app = Flask(__name__)


@app.route('/', methods=['POST'])
#@app.route("/")
def hello():
    base64data = request.form['image']
    resultat =  mainmodel(base64data)
    return jsonify(resultat)

if __name__ == '__main__':
    app.run(debug=True)
