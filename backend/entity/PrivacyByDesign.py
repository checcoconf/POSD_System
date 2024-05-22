from flask import jsonify
from backend.db import conn_db

# Connessione al database MongoDB
db = conn_db()
privacyByDesignCollection = db['PrivacyByDesign']  # Collezione PrivacyByDesign

class PrivacyByDesign:
    def __init__(self, id, title, description):
        self.id = id
        self.title = title
        self.description = description

    @staticmethod
    def getPrivacyByDesign():
        collection = privacyByDesignCollection.find({}, {'_id': False})
        return jsonify(list(collection))