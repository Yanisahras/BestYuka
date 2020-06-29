from flask import Flask, request, jsonify
from testmodelpy import mainmodel
app = Flask(__name__)


@app.route('/', methods=['POST'])
#@app.route("/")
def hello():

    try:
        base64data = request.form['image']
        resultat =  mainmodel(base64data)
        print(type(resultat))
        #return jsonify(resultat)
        return resultat
          #flask.make_response(jsonify(resultat),200)
    except:
        print('erreur serveuuuuuur <------------------->')

if __name__ == '__main__':
    app.run(debug=True)
