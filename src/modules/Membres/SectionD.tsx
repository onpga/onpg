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
    nom: 'Garcia',
    prenom: 'Carlos',
    section: 'D',
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face',
    role: 'Fabricant',
    these: 'Thèse sur la fabrication pharmaceutique'
  },
  {
    _id: 'mock2',
    nom: 'Rodriguez',
    prenom: 'Maria',
    section: 'D',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face',
    role: 'Grossiste',
    these: 'Thèse sur la distribution pharmaceutique'
  }
];

const SectionD = () => (
  <SectionTemplate
    section="D"
    subtitle="Fabricants & Grossistes"
    description="Professionnels de la fabrication, de la distribution et de la logistique pharmaceutique."
    accentClass="is-d"
    mockPharmaciens={mockPharmaciens}
  />
);

export default SectionD;
