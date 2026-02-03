import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ONPGLayout from './components/Layout/ONPGLayout';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './components/Toast';

// Lazy loading des routes publiques (code splitting)
const AccueilONPG = lazy(() => import('./modules/AccueilONPG/AccueilONPG'));

// Ressources
const RessourcesActualites = lazy(() => import('./modules/Ressources/RessourcesActualites'));
const RessourcesArticleDetail = lazy(() => import('./modules/Ressources/ArticleDetail'));
const Communiques = lazy(() => import('./modules/Ressources/Communiques'));
const Photos = lazy(() => import('./modules/Ressources/Photos'));
const Videos = lazy(() => import('./modules/Ressources/Videos'));
const TrouverPharmacie = lazy(() => import('./modules/Ressources/TrouverPharmacie'));
const RessourcesArticles = lazy(() => import('./modules/Ressources/Articles'));
const Theses = lazy(() => import('./modules/Ressources/Theses'));
const Decrets = lazy(() => import('./modules/Ressources/Decrets'));
const Decisions = lazy(() => import('./modules/Ressources/Decisions'));
const Commissions = lazy(() => import('./modules/Ressources/Commissions'));
const Lois = lazy(() => import('./modules/Ressources/Lois'));

// L'Ordre
const AProposOrdre = lazy(() => import('./modules/Ordre/APropos'));
const Instance = lazy(() => import('./modules/Ordre/Instance'));
const Organigramme = lazy(() => import('./modules/Ordre/Organigramme'));
const ConseilNational = lazy(() => import('./modules/Ordre/ConseilNational'));

// Membres
const TableauOrdre = lazy(() => import('./modules/Membres/TableauOrdre'));
const SectionA = lazy(() => import('./modules/Membres/SectionA'));
const SectionB = lazy(() => import('./modules/Membres/SectionB'));
const SectionC = lazy(() => import('./modules/Membres/SectionC'));
const SectionD = lazy(() => import('./modules/Membres/SectionD'));

// Pratique
const FormationContinue = lazy(() => import('./modules/Pratique/FormationContinue'));
const Deontologie = lazy(() => import('./modules/Pratique/Deontologie'));
const Pharmacies = lazy(() => import('./modules/Pratique/Pharmacies'));
const ContactPratique = lazy(() => import('./modules/Pratique/ContactPratique'));

// Templates Indépendants

// Showcase des Templates
// TemplateShowcase supprimé

// Templates supprimés
const APropos = lazy(() => import('./modules/APropos/APropos'));
const Poles = lazy(() => import('./modules/Poles/Poles'));
const Realisations = lazy(() => import('./modules/Realisations/Realisations'));
const ProjectDetail = lazy(() => import('./modules/Realisations/ProjectDetail'));
const Actualites = lazy(() => import('./modules/Actualites/Actualites'));
const ArticleDetail = lazy(() => import('./modules/Actualites/ArticleDetail'));
// Imports nettoyés - layouts de test supprimés
// Layouts de test pour la page d'accueil - SUPPRIMÉS (module Accueil supprimé)
const Contact = lazy(() => import('./modules/Contact/Contact'));
const Carrieres = lazy(() => import('./modules/Carrieres/Carrieres'));
const JobDetail = lazy(() => import('./modules/Carrieres/JobDetail'));
const Devis = lazy(() => import('./modules/Devis/Devis'));
const Simulateur = lazy(() => import('./modules/Simulateur'));
const FAQ = lazy(() => import('./modules/FAQ'));
const MentionsLegales = lazy(() => import('./modules/Legal/MentionsLegales'));
const PolitiqueConfidentialite = lazy(() => import('./modules/Legal/PolitiqueConfidentialite'));
const CGU = lazy(() => import('./modules/Legal/CGU'));
const DocumentationAdmin = lazy(() => import('./modules/DocumentationAdmin/DocumentationAdmin'));

// Lazy loading des routes Wiki
const WikiLogin = lazy(() => import('./modules/Wiki/WikiLogin'));
const WikiDashboard = lazy(() => import('./modules/Wiki/WikiDashboard'));
const WikiUsers = lazy(() => import('./modules/Wiki/WikiUsers'));
const WikiSettings = lazy(() => import('./modules/Wiki/WikiSettings'));

// Lazy loading des routes Admin (plus lourdes)
const Login = lazy(() => import('./modules/Admin/Login'));
const Dashboard = lazy(() => import('./modules/Admin/Dashboard'));
const Analytics = lazy(() => import('./modules/Admin/Analytics'));
const Simulations = lazy(() => import('./modules/Admin/Simulations'));
const Articles = lazy(() => import('./modules/Admin/Articles'));
const ArticleForm = lazy(() => import('./modules/Admin/ArticleForm'));
const Calendar = lazy(() => import('./modules/Admin/Calendar'));
const IdeaBlocks = lazy(() => import('./modules/Admin/IdeaBlocks'));
const Settings = lazy(() => import('./modules/Admin/Settings'));
const Jobs = lazy(() => import('./modules/Admin/Jobs'));
const JobForm = lazy(() => import('./modules/Admin/JobForm'));
const Logs = lazy(() => import('./modules/Admin/Logs'));
const Projects = lazy(() => import('./modules/Admin/Projects/Projects'));
const ProjectForm = lazy(() => import('./modules/Admin/Projects/ProjectForm'));

// Composant de chargement simple
const LoadingSpinner = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '50vh',
    fontSize: '18px',
    color: '#002F6C'
  }}>
    Chargement...
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Routes Admin (sans Layout) */}
            <Route path="/admin" element={<Login />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/analytics" element={<Analytics />} />
            <Route path="/admin/simulations" element={<Simulations />} />
            <Route path="/admin/articles" element={<Articles />} />
            <Route path="/admin/articles/new" element={<ArticleForm />} />
            <Route path="/admin/articles/edit/:id" element={<ArticleForm />} />
            <Route path="/admin/projects" element={<Projects />} />
            <Route path="/admin/projects/new" element={<ProjectForm />} />
            <Route path="/admin/projects/edit/:id" element={<ProjectForm />} />
            <Route path="/admin/jobs" element={<Jobs />} />
            <Route path="/admin/jobs/new" element={<JobForm />} />
            <Route path="/admin/jobs/edit/:id" element={<JobForm />} />
            <Route path="/admin/calendar" element={<Calendar />} />
            <Route path="/admin/idea-blocks" element={<IdeaBlocks />} />
            <Route path="/admin/logs" element={<Logs />} />
            <Route path="/admin/settings" element={<Settings />} />
            
            {/* Documentation Admin - redirection directe vers HTML */}
            <Route path="/documentation-admin" element={<DocumentationAdmin />} />

            {/* Routes Wiki (sans Layout) */}
            <Route path="/wiki/login" element={<WikiLogin />} />
            <Route path="/wiki" element={<WikiDashboard />} />
            <Route path="/wiki/users" element={<WikiUsers />} />
            <Route path="/wiki/settings" element={<WikiSettings />} />

            {/* Routes avec ONPGLayout */}
            <Route path="/*" element={
              <ONPGLayout>
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                    <Route path="/" element={<AccueilONPG />} />
                    <Route path="/onpg" element={<AccueilONPG />} />
                    <Route path="/ressources/actualites" element={<RessourcesActualites />} />
                    <Route path="/ressources/actualites/:id" element={<RessourcesArticleDetail />} />
                    <Route path="/ressources/communiques" element={<Communiques />} />
                    <Route path="/ressources/photos" element={<Photos />} />
                    <Route path="/ressources/videos" element={<Videos />} />
                    <Route path="/trouver-pharmacie" element={<TrouverPharmacie />} />
                    <Route path="/ressources/articles" element={<RessourcesArticles />} />
                    <Route path="/ressources/theses" element={<Theses />} />
                    <Route path="/ressources/decrets" element={<Decrets />} />
                    <Route path="/ressources/decisions" element={<Decisions />} />
                    <Route path="/ressources/commissions" element={<Commissions />} />
                    <Route path="/ressources/lois" element={<Lois />} />

                    {/* L'Ordre */}
                    <Route path="/ordre/a-propos" element={<AProposOrdre />} />
                    <Route path="/ordre/instance" element={<Instance />} />
                    <Route path="/ordre/organigramme" element={<Organigramme />} />
                    <Route path="/ordre/conseil-national" element={<ConseilNational />} />

                    {/* Membres */}
                    <Route path="/membres/tableau-ordre" element={<TableauOrdre />} />
                    <Route path="/membres/section-a" element={<SectionA />} />
                    <Route path="/membres/section-b" element={<SectionB />} />
                    <Route path="/membres/section-c" element={<SectionC />} />
                    <Route path="/membres/section-d" element={<SectionD />} />

                    {/* Pratique */}
                    <Route path="/pratique/formation-continue" element={<FormationContinue />} />
                    <Route path="/pratique/deontologie" element={<Deontologie />} />
                    <Route path="/pratique/pharmacies" element={<Pharmacies />} />
                    <Route path="/pratique/contact" element={<ContactPratique />} />

                    {/* Templates Indépendants */}


                    {/* Templates individuels */}
// Templates supprimés
                    <Route path="/apropos" element={<APropos />} />
                    <Route path="/poles" element={<Poles />} />
                    <Route path="/poles/:id" element={<Poles />} />
                    <Route path="/realisations" element={<Realisations />} />
                    <Route path="/realisations/:id" element={<ProjectDetail />} />
                    <Route path="/actualites" element={<Actualites />} />
                    <Route path="/actualites/:slug" element={<ArticleDetail />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/devis" element={<Devis />} />
                    <Route path="/simulateur" element={<Simulateur />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/carrieres" element={<Carrieres />} />
                    <Route path="/carrieres/:jobId" element={<JobDetail />} />
                    <Route path="/mentions-legales" element={<MentionsLegales />} />
                    <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
                    <Route path="/cgu" element={<CGU />} />
                    <Route path="/documentation-admin" element={<DocumentationAdmin />} />
                  </Routes>
                </Suspense>
              </ONPGLayout>
            } />
          </Routes>
        </Suspense>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;

