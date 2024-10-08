import { useEffect, useState, useRef } from 'react';
import { Avatar, Box, Button, Card, CardContent, Container, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
    getWelcomeMessage,
    renderDettagliProfilo,
    /*handleAvatarChange, handleAvatarClick */
} from '../GestioneProfili.jsx';
import PropTypes from 'prop-types';
import axios from "axios";
import StoricoSegnalazioni from "../../Componenti globali/Storico.jsx";
import SetSegnalazioni from "../../GestioneSegnalazione/SetSegnalazioni.jsx";

//funzioni CISO
function base64ToBlob(base64Data, contentType) {
    const byteCharacters = atob(base64Data.split(',')[1]);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
}

export default function ProfiloCISO(props) {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [storicoSegnalazioniVisibile, setStoricoSegnalazioniVisibile] = useState(false);
    const [aggiungiLicenzaVisibile, setAggiungiLicenzaVisibile] = useState(false);
    const [segnalazioniVisibile, setSegnalazioniVisibile] = useState(false);

    const [profilo, setProfilo] = useState({ nome: '', cognome: '', email: '', ruolo: '', genere: '' });
    const [status, setStatus] = useState(''); // Correctly initialized status state
    const [file, setFile] = useState(null);
    const [fileUrl, setFileUrl] = useState(null); // Stato per l'URL del file
    const [licenzaNome, setLicenzaNome] = useState('Nessun file presente'); // Stato per il nome della licenza
    const [avatar] = useState('https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp');

    useEffect(() => {
        const DatiAnagrafici = async () => {
            if (!props.token) {
                console.error("Token non disponibile");
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/api/profilo', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${props.token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`Errore: ${response.status}`);
                }

                const data = await response.json();
                setProfilo(data);
                if (data.licenza) {
                    const blob = base64ToBlob(data.licenza, 'application/pdf');
                    const url = URL.createObjectURL(blob);
                    setFileUrl(url);
                }
            } catch (error) {
                console.error("Errore durante il recupero del profilo:", error);
            }
        };

        DatiAnagrafici();
    }, [props.token]);

    const ScaricaLicenza = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/recuperalicenza', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${props.token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Errore: ${response.status}`);
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            // Pulsante per scaricare
            const disposition = response.headers.get('Content-Disposition');
            const nomeFile = disposition ? disposition.split('filename=')[1].replace(/"/g, '') : 'licenza.pdf';

            setFileUrl(url);
            setLicenzaNome(nomeFile);
        } catch (error) {
            console.error("Errore durante il recupero della licenza:", error);
        }
    };

    useEffect(() => {
        ScaricaLicenza();
    }, []);

    const SegnalazioniAccettateRifiutate = () => {
        setSegnalazioniVisibile(!segnalazioniVisibile);
        setAggiungiLicenzaVisibile(false);
        setStoricoSegnalazioniVisibile(false);
    };
    const Storico = () => {
        setStoricoSegnalazioniVisibile(!storicoSegnalazioniVisibile);
        setAggiungiLicenzaVisibile(false);
        setSegnalazioniVisibile(false);
    };

    const InserisciLicenza = () => {
        setAggiungiLicenzaVisibile(!aggiungiLicenzaVisibile);
        setSegnalazioniVisibile(false);
        setStoricoSegnalazioniVisibile(false);
    };

    const handleFileUpload = async () => {
        if (!validateFILE()) {
            fileInputRef.current.click();
            return;
        }

        const formData = new FormData();
        formData.append('licenza', file);

        try {
            const response = await axios.post(
                'http://localhost:5000/api/caricalicenza',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${props.token}`,
                    },
                }
            );

            setStatus(response.data.messaggio);
            // Force page refresh to reload data
            navigate(0);
        } catch (error) {
            console.error("Risposta errore:", error.response);
            if (error.response?.data?.messaggio) {
                setStatus(error.response.data.messaggio);
            } else {
                setStatus('Si è verificato un errore durante l\'elaborazione della richiesta.');
            }
        }
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        const allowedExtensions = [".cer", ".crt", ".pem", ".p12", ".pfx", ".der", ".p7b", ".p7c", ".key", ".pdf"];

        // Estrai l'estensione del file
        const fileExtension = selectedFile.name.split(".").pop().toLowerCase();

        // Controlla se l'estensione è consentita
        if (!allowedExtensions.includes("." + fileExtension)) {
            // Se l'estensione non è consentita, mostra un avviso all'utente
            alert("Formato del file non supportato. Si prega di selezionare un file con un'estensione valida.");
            event.target.value = null; // Cancella il file selezionato
            return;
        }

        // Se l'estensione è valida, imposta il file nello stato
        setFile(selectedFile);
        setLicenzaNome(selectedFile.name); // Update the licenzaNome state to show the file name
    };

    const handleFileDownload = () => {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.setAttribute('download', licenzaNome);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const validateFILE = () => {
        if (!file) {
            setStatus('Il file è vuoto');
            return false;
        }
        setStatus(null);
        return true;
    };

    return (
        <Container sx={{ py: 5 }}>
            <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                    <Card sx={{ mb: 4, mx: { xs: 0, md: 5 } }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Box >
                                <Avatar
                                    src={avatar}
                                    sx={{ width: 150, height: 150, mx: 'auto', mb: 4 }}
                                />

                            </Box>
                            <Typography variant="h6" gutterBottom>{getWelcomeMessage(profilo.genere)}</Typography>
                            <Typography variant="h4" gutterBottom>{profilo.nome}</Typography>
                            <Typography variant="subtitle1">{profilo.ruolo}</Typography>
                            <Box sx={{ mt: 5, mb: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Button variant="contained" color="warning" onClick={InserisciLicenza}
                                    sx={{ mb: 2, width: '100%', maxWidth: '300px' }}>
                                    Licenza
                                </Button>

                                <Button variant="contained" color="warning" onClick={SegnalazioniAccettateRifiutate}
                                    sx={{ mb: 2, width: '100%', maxWidth: '300px' }}>
                                    Segnalazioni
                                </Button>
                                <Button variant="contained" color="warning" onClick={Storico}
                                    sx={{ width: '100%', maxWidth: '300px' }}>
                                    Storico Segnalazioni
                                </Button>
                            </Box>
                        </CardContent>
                        <Avatar
                            src="/logo.png"
                            alt="logo"
                            sx={{ width: 50, height: 50, mx: 'auto', my: 2 }}
                        />
                    </Card>
                </Grid>
                <Grid item xs={12} md={8}>
                    <Card sx={{ mb: 4 }}>
                        <CardContent>
                            <Grid container spacing={2}>
                                {renderDettagliProfilo(profilo)}
                                <Grid item xs={12}>
                                    <hr />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <Typography variant="subtitle1">Licenza</Typography>
                                </Grid>
                                <Grid item xs={12} md={9}>
                                    <Typography variant="body1" color="text.secondary">{licenzaNome}</Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    <Grid container>
                        <Grid item xs={12}>
                            <Card sx={{ mb: 4 }}>
                                <CardContent>
                                    {segnalazioniVisibile && (<SetSegnalazioni token={props.token} ruolo={profilo.ruolo} />)}
                                    {storicoSegnalazioniVisibile &&
                                        <StoricoSegnalazioni token={props.token} ruolo={profilo.ruolo} />}
                                    {aggiungiLicenzaVisibile && (
                                        <Box>
                                            <input
                                                type="file"
                                                onChange={handleFileChange}
                                                style={{ display: 'block', marginBottom: '0.5%', marginTop: "5%" }}
                                            />
                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                <Button variant="contained" color="secondary" onClick={InserisciLicenza}
                                                    sx={{ mr: 2 }}>
                                                    Annulla
                                                </Button>
                                                <Button variant="contained" color="success" onClick={handleFileUpload}
                                                    sx={{ mr: 2 }} ref={fileInputRef}>
                                                    Carica Licenza
                                                </Button>
                                                {fileUrl && (
                                                    <Button variant="contained" color="primary"
                                                        onClick={handleFileDownload}>
                                                        Scarica Licenza
                                                    </Button>
                                                )}
                                            </Box>
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
}

ProfiloCISO.propTypes = {
    token: PropTypes.string.isRequired
};
