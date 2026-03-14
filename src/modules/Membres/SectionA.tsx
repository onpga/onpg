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
    nom: 'Dupont',
    prenom: 'Marie',
    section: 'A',
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face',
    role: 'Pharmacien titulaire',
    these: 'Thèse sur la pharmacie clinique'
  },
  {
    _id: 'mock2',
    nom: 'Martin',
    prenom: 'Jean',
    section: 'A',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    role: 'Pharmacien adjoint',
    these: 'Thèse sur la pharmacovigilance'
  },
  {
    _id: 'mock3',
    nom: 'Bernard',
    prenom: 'Sophie',
    section: 'A',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face',
    role: 'Pharmacien titulaire',
    these: 'Thèse sur la pharmacie hospitalière'
  }
];

const SectionA = () => (
  <SectionTemplate
    section="A"
    subtitle="Officinaux"
    description="Pharmaciens titulaires et adjoints d'officine exerçant dans la dispensation de proximité."
    accentClass="is-a"
    mockPharmaciens={mockPharmaciens}
  />
);

export default SectionA;
