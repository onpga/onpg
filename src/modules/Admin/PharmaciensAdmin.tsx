import AdminSidebar from './components/AdminSidebar';
import './Dashboard.css';

interface Pharmacien {
  id: string;
  nom: string;
  prenom: string;
  ville: string;
}

// Mock simple pour afficher une liste cohérente en attendant la connexion à la base
const mockPharmaciens: Pharmacien[] = [
  { id: '1', nom: 'Dupont', prenom: 'Marie', ville: 'Libreville' },
  { id: '2', nom: 'Ngoma', prenom: 'Paul', ville: 'Port-Gentil' },
  { id: '3', nom: 'Moukagni', prenom: 'Sarah', ville: 'Franceville' }
];

const PharmaciensAdmin = () => {
  return (
    <div className="dashboard-page">
      <AdminSidebar currentPage="pharmaciens" />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1>👨‍⚕️ Gestion des pharmaciens</h1>
          <p>Cette page contiendra la liste des pharmaciens inscrits à l&apos;Ordre, avec possibilité d&apos;ajout / modification / suppression.</p>
        </div>

        <section className="dashboard-section">
          <h2>Liste des pharmaciens (exemple)</h2>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Prénom</th>
                  <th>Ville</th>
                </tr>
              </thead>
              <tbody>
                {mockPharmaciens.map((pharmacien) => (
                  <tr key={pharmacien.id}>
                    <td>{pharmacien.nom}</td>
                    <td>{pharmacien.prenom}</td>
                    <td>{pharmacien.ville}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PharmaciensAdmin;


