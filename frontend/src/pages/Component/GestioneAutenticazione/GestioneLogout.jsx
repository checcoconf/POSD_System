import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import PropTypes from 'prop-types';

function GestioneLogout({setToken, removeRuolo}) {
    const navigate = useNavigate();

    useEffect(() => {
        // Rimuovi il token di accesso e altri dati correlati
        setToken(null);
        removeRuolo();

        // Pulisci il sessionStorage o il localStorage
        sessionStorage.removeItem('token');
        localStorage.removeItem('token');

        // Reindirizza alla pagina di login o alla home page
        navigate('/Login');
    }, [navigate, setToken, removeRuolo]);

    return (
        <div>
            <p>Effettuando il logout...</p>
            {/* Puoi aggiungere qui un'animazione di caricamento o un messaggio di conferma */}
        </div>
    );
}

GestioneLogout.propTypes = {
    setToken: PropTypes.func.isRequired,
    removeRuolo: PropTypes.func.isRequired,
};

export default GestioneLogout;
