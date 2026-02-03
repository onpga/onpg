import { useParams } from 'react-router-dom';
import Energie from './Energie';
import Geospatial from './Geospatial';
import ODS from './ODS';
import SecuriteNumerique from './SecuriteNumerique';
import Sante from './Sante';
import PolesOverview from './components/PolesOverview';

const Poles = () => {
  const { id } = useParams();

  // Si aucun ID, afficher la vue d'ensemble des pôles
  if (!id) {
    return <PolesOverview />;
  }

  // Router vers le pôle spécifique
  switch (id) {
    case 'energie':
      return <Energie />;
    case 'geospatial':
      return <Geospatial />;
    case 'drone':
      return <ODS />;
    case 'securite':
      return <SecuriteNumerique />;
    case 'sante':
      return <Sante />;
    default:
      return (
        <div className="poles-page">
          <section className="section">
            <div className="container">
              <h1>Pôle non trouvé</h1>
              <p>Ce pôle n'existe pas.</p>
            </div>
          </section>
        </div>
      );
  }
};

export default Poles;

