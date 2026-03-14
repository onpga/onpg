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
    nom: 'Dubois',
    prenom: 'Pierre',
    section: 'B',
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face',
    role: 'Biologiste médical',
    these: 'Thèse sur la biologie clinique'
  },
  {
    _id: 'mock2',
    nom: 'Petit',
    prenom: 'Nathalie',
    section: 'B',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face',
    role: 'Biologiste médical',
    these: 'Thèse sur les analyses médicales'
  }
];

const SectionB = () => (
  <SectionTemplate
    section="B"
    subtitle="Biologistes"
    description="Pharmaciens biologistes engagés dans les analyses biomédicales et la qualité diagnostique."
    accentClass="is-b"
    mockPharmaciens={mockPharmaciens}
  />
);

export default SectionB;
