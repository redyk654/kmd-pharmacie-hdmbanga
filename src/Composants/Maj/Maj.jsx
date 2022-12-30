import React, { useState } from 'react';
import Approvisionner from '../Approvisionner/Approvisionner';
import Bordereau from '../Bordereau/Bordereau';
import ModifierProduit from '../ModifierProduit/ModifierProduit';
import './Maj.css';

import { useSpring, animated } from 'react-spring';
import { FaList, FaPen, FaTruck, FaTruckMoving } from 'react-icons/fa';

export default function Maj(props) {

    const props1 = useSpring({ to: { opacity: 1 }, from: { opacity: 0 } });

    const [onglet, setOnglet] = useState(1);
    let contenu;
    
    switch(onglet) {
      case 1:
        contenu = <Approvisionner nomConnecte={props.nomConnecte} />
        break;
      case 2:
        contenu = <ModifierProduit />
        break;
      case 3:
        contenu = <Bordereau nomConnecte={props.nomConnecte} />
        break;
    }

    return (
      <animated.div style={props1}>
        <section className="conteneur-sous-onglets">
          <div className="onglets-blocs" style={{width: '65%'}}>
            <div className={`tab ${onglet === 1 ? 'active' : ''}`} onClick={ () => {setOnglet(1)}}>
              <FaTruck size={24} />
              &nbsp;
              Approvisionner
            </div>
            <div className={`tab ${onglet === 2 ? 'active' : ''}`} onClick={ () => {setOnglet(2)}}>
              <FaPen size={20} />
              &nbsp;
              Modifier infos
            </div>
            <div className={`tab ${onglet === 3 ? 'active' : ''}`} onClick={ () => {setOnglet(3)}}>
              <FaList size={22} />
              &nbsp;
              Commandes
            </div>
          </div>
          <div className="onglets-contenu">
              {contenu}
          </div>
        </section>
      </animated.div>
    )
}
