import SectionTemplate from './SectionTemplate';

interface Pharmacien {
  _id?: string;
  nom: string;
  prenom: string;
  section?: string;
  photo?: string;
  role?: string;
  these?: string;
}

const mockPharmaciens: Pharmacien[] = [
  {
    _id: 'mock1',
    nom: 'Leroy',
    prenom: 'Antoine',
    section: 'C',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    role: 'Pharmacien fonctionnaire',
    these: 'Thèse sur la pharmacie publique'
  },
  {
    _id: 'mock2',
    nom: 'Moreau',
    prenom: 'Alain',
    section: 'C',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    role: 'Pharmacien fonctionnaire',
    these: 'Thèse sur la santé publique'
  }
];

const SectionC = () => (
  <SectionTemplate
    section="C"
    subtitle="Fonctionnaires"
    description="Pharmaciens de la fonction publique impliqués dans la régulation et la santé publique."
    accentClass="is-c"
    mockPharmaciens={mockPharmaciens}
  />
);

export default SectionC;
