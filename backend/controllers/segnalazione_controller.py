from flask import Blueprint
from backend.models.message_reporting import Segnalazione

segnalazione_bp = Blueprint('segnalazione_bp', __name__)


@segnalazione_bp.route('/api/segnalazione', methods=['POST'])
def add_segnalazione():
    return Segnalazione.insertSegnalazione()
