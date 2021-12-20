import React, { useEffect, useState, useContext, useRef, Fragment } from 'react';
import './Etats.css';
import { ContextChargement } from '../../Context/Chargement';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";


export default function Etats(props) {

    const componentRef = useRef();
    const admin = "admin";


    let date_select1 = useRef();
    let date_select2 = useRef();
    let heure_select1 = useRef();
    let heure_select2 = useRef();

    const {chargement, stopChargement, startChargement} = useContext(ContextChargement);

    const [historique, sethistorique] = useState([]);
    const [historiqueSauvegarde, setHistoriqueSauvegarde] = useState([]);
    const [listeComptes, setListeComptes] = useState([]);
    const [dateJour, setdateJour] = useState('');
    const [recetteTotal, setRecetteTotal] = useState(false);
    const [dateDepart, setdateDepart] = useState('');
    const [dateFin, setdateFin] = useState('');
    const [search, setSearch] = useState(false);
    const [caissier, setCaissier] = useState('');
    const [filtre, setFiltre] = useState(false);
    const [non_paye, setNonPaye] = useState(false);

    useEffect(() => {
        startChargement();

        if (dateDepart.length > 0 && dateFin.length > 0) {

            let dateD = dateDepart;
            let dateF = dateFin;

            const data = new FormData();
            data.append('dateD', dateD);
            data.append('dateF', dateF);

            const req = new XMLHttpRequest();
            req.open('POST', `http://serveur/backend-cma/etats.php`);
            
            req.addEventListener('load', () => {
                const result = JSON.parse(req.responseText);
                sethistorique(result.filter(item => (item.status_vente === "payé")));
                setHistoriqueSauvegarde(result);
                stopChargement();
                let recette = 0;
                if (result.length > 0) {
                    result.map(item => {
                        if (item.status_vente === "payé") {
                            recette += parseInt(item.prix_total);
                        }
                    });
                    setRecetteTotal(recette);
                    if (props.role !== admin) {
                        setFiltre(true);
                        setCaissier(props.nomConnecte);
                    }

                } else {
                    setRecetteTotal(0);
                }
            });

            req.send(data);
        }

    }, [dateDepart, dateFin, search]);

    useEffect(() => {
        if (filtre) {
            let recette = 0;
            let tab = historiqueSauvegarde.filter(item => (item.nom_vendeur.toUpperCase() === caissier.toUpperCase()));
            if (tab.length === 0) {
                sethistorique([]);
                setRecetteTotal(0);
            } else {
                if (non_paye) {
                    tab = tab.filter(item => (item.status_vente.toLowerCase() === "non payé"));
                    tab.map(item => {
                        recette += parseInt(item.prix_total);
                    });
                } else {
                    tab.map(item => {
                        if (item.status_vente === "payé") {
                            recette += parseInt(item.prix_total);
                        }
                    });

                    tab = tab.filter(item => (item.status_vente.toLowerCase() === "payé"));
                }
                sethistorique(tab);
                setRecetteTotal(recette);
            }
        } else {
            let recette = 0;
            sethistorique(historiqueSauvegarde.filter(item => (item.status_vente === "payé")));
            historiqueSauvegarde.map(item => {
                if (item.status_vente === "payé") {
                    recette += parseInt(item.prix_total);
                }
            });
            setRecetteTotal(recette);
        }
    }, [caissier, filtre, non_paye]);

    useEffect(() => {
        // Récupération des comptes

        const req = new XMLHttpRequest();
        req.open('GET', 'http://serveur/backend-cma/recuperer_comptes.php');

        req.addEventListener('load', () => {
            if(req.status >= 200 && req.status < 400) {
                let result = JSON.parse(req.responseText);
                result = result.filter(item => (item.rol === "vendeur" || item.rol === "major"))
                setListeComptes(result);
                setCaissier(result[0].nom_user.toUpperCase())
            }
        });

        req.send();
    }, []);

    const rechercherHistorique = () => {
        setSearch(!search);
        setdateDepart(date_select1.current.value + ' ' + heure_select1.current.value + ':00');
        setdateFin(date_select2.current.value + ' ' + heure_select2.current.value + ':59');
    }

    const mois = (str) => {

        switch(parseInt(str.substring(3, 5))) {
            case 1:
                return str.substring(0, 2) + " janvier " + str.substring(6, 10);
            case 2:
                return str.substring(0, 2) + " fevrier " + str.substring(6, 10);
            case 3:
                return str.substring(0, 2) + " mars " + str.substring(6, 10);
            case 4:
                return str.substring(0, 2) + " avril " +  str.substring(6, 10);
            case 5:
                return str.substring(0, 2) + " mai " + str.substring(6, 10);
            case 6:
                return str.substring(0, 2) + " juin " + str.substring(6, 10);
            case 7:
                return str.substring(0, 2) + " juillet " + str.substring(6, 10);
            case 8:
                return str.substring(0, 2) + " août " + str.substring(6, 10);
            case 9:
                return str.substring(0, 2) + " septembre " + str.substring(6, 10);
            case 10:
                return str.substring(0, 2) + " octobre " + str.substring(6, 10);
            case 11:
                return str.substring(0, 2) + " novembre " + str.substring(6, 10);
            case 12:
                return str.substring(0, 2) + " décembre " + str.substring(6, 10);
        }
    }

    return (
        <section className="etats">
            <h1>Historique des ventes</h1>
            <div className="container-historique">
                <div className="table-commandes">
                    <div className="entete-historique">
                        <div>
                            <p>
                                <label htmlFor="">Du : </label>
                                <input type="date" ref={date_select1} />
                                <input type="time" ref={heure_select1} />
                            </p>
                            <p>
                                <label htmlFor="">Au : </label>
                                <input type="date" ref={date_select2} />
                                <input type="time" ref={heure_select2} />
                            </p>
                            <p>
                                {
                                props.role === admin && 
                                <Fragment>
                                    <label htmlFor="filtre">Filtrer : </label>
                                    <input type="checkbox" id="filtre" checked={filtre} onChange={(e) => setFiltre(!filtre)} />
                                </Fragment>
                                }
                            </p>
                            <p style={{display: `${filtre ? 'block' : 'none'}`}}>
                            <p>
                                <label htmlFor="non_paye">non payés : </label>
                                <input type="checkbox" id="non_paye" checked={non_paye} onChange={(e) => setNonPaye(!non_paye)} />
                            </p>
                            <label htmlFor="">Vendeur : </label>
                                <select name="caissier" id="caissier" onChange={(e) => setCaissier(e.target.value)}>
                                    {props.role !== admin ? 
                                    <option value={props.nomConnecte}>{props.nomConnecte.toUpperCase()}</option> :
                                    listeComptes.map(item => (
                                        <option value={item.nom_user}>{item.nom_user.toUpperCase()}</option>
                                    ))}
                                </select>
                            </p>
                        </div>
                        <button onClick={rechercherHistorique}>rechercher</button>
                        <div>Recette total : <span style={{fontWeight: '700'}}>{recetteTotal ? recetteTotal + ' Fcfa' : '0 Fcfa'}</span></div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <td>Le</td>
                                <td>À</td>
                                <td>Par</td>
                                <td>Désignation</td>
                                <td>Qte sortie</td>
                                <td>Montant</td>
                                <td>Status</td>
                            </tr>
                        </thead>
                        <tbody>
                            {historique.length > 0 ? historique.map(item => (
                                <tr>
                                    <td>{mois(item.date_heure.substring(0, 10))}</td>
                                    <td>{item.date_heure.substring(11)}</td>
                                    <td>{item.nom_vendeur}</td>
                                    <td>{item.designation}</td>
                                    <td>{item.quantite}</td>
                                    <td>{item.prix_total + ' Fcfa'}</td>
                                    <td>{item.status_vente}</td>
                                </tr>
                            )) : null}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    )
}
