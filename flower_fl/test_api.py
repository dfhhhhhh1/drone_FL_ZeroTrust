from flask import Flask, jsonify
from flask_cors import CORS


app = Flask(__name__)
CORS(app)



# Static data from the FL model
data = {
    "cicids_reduced": {
        "threshold": 21.19773648759158,
        "metrics": {
            "acc": 0.97552783109405,
            "rec": 0.8803912850155625,
            "prec": 0.9232921426906039,
            "f1": 0.901331512461591,
            "mcc": 0.8876994435686923,
            "missrate": 0.11960871498443752,
            "fallout": 0.010636922082120918,
            "auc": 0.9348771814667207
        },
        "mean_attack_loss": 30.65118102002768,
        "mean_benign_loss": 21.223582044354703
    },
    "toniot_reduced": {
        "threshold": 16.66052586800868,
        "metrics": {
            "acc": 0.855616977419657,
            "rec": 0.8544234327468875,
            "prec": 0.9470921542044703,
            "f1": 0.8983743858608601,
            "mcc": 0.6617690931285918,
            "missrate": 0.14557656725311255,
            "fallout": 0.14086071263304026,
            "auc": 0.8567813600569236
        },
        "mean_attack_loss": 21.90956732575329,
        "mean_benign_loss": 16.716496991164714
    },
    "botiot_reduced": {
        "threshold": 19.785363863364488,
        "metrics": {
            "acc": 0.9005685384794734,
            "rec": 0.9001801801801802,
            "prec": 0.9999199423584981,
            "f1": 0.9474322991731775,
            "mcc": 0.19637557442628148,
            "missrate": 0.09981981981981981,
            "fallout": 0.01556420233463035,
            "auc": 0.9423079889227751
        },
        "mean_attack_loss": 25.85001237469306,
        "mean_benign_loss": 19.671458516316008
    }
}

# API endpoint to retrieve the data
@app.route('/data', methods=['GET'])
def get_data():
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
		