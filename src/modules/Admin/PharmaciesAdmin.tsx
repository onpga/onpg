import AdminSidebar from './components/AdminSidebar';
import './Dashboard.css';

interface Pharmacy {
  id: string;
  name: string;
  city: string;
  quartier: string;
}

// Mock simple pour afficher une liste cohérente en attendant la connexion à la base
const mockPharmacies: Pharmacy[] = [
  { id: '1', name: 'Pharmacie Centrale', city: 'Libreville', quartier: 'Centre-ville' },
  { id: '2', name: 'Pharmacie du Bord de Mer', city: 'Libreville', quartier: 'Bord de mer' },
  { id: '3', name: 'Pharmacie Owendo', city: 'Owendo', quartier: 'Owendo' }
];

const PharmaciesAdmin = () => {
  return (
    <div className="dashboard-page">
      <AdminSidebar currentPage="pharmacies" />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1>🏥 Gestion des pharmacies</h1>
          <p>Cette page contiendra la liste des pharmacies (annuaire), avec possibilité d&apos;ajout / modification / suppression.</p>
        </div>

        <section className="dashboard-section">
          <h2>Liste des pharmacies (exemple)</h2>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Ville</th>
                  <th>Quartier</th>
                </tr>
              </thead>
              <tbody>
                {mockPharmacies.map((pharmacy) => (
                  <tr key={pharmacy.id}>
                    <td>{pharmacy.name}</td>
                    <td>{pharmacy.city}</td>
                    <td>{pharmacy.quartier}</td>
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

export default PharmaciesAdmin;


