import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ONPGLayout from './components/Layout/ONPGLayout';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './components/Toast';

// Lazy loading des routes publiques (code splitting)
const AccueilONPG = lazy(() => import('./modules/AccueilONPG/AccueilONPG'));

// Ressources
const RessourcesActualites = lazy(() => import('./modules/Ressources/RessourcesActualites'));
const RessourcesArticleDetail = lazy(() => import('./modules/Ressources/ArticleDetail'));
const Communiques = lazy(() => import('./modules/Ressources/Communiques'));
const CommuniqueDetail = lazy(() => import('./modules/Ressources/CommuniqueDetailPage'));
const Photos = lazy(() => import('./modules/Ressources/Photos'));
const PhotoDetail = lazy(() => import('./modules/Ressources/PhotoDetail'));
const Videos = lazy(() => import('./modules/Ressources/Videos'));
const VideoDetail = lazy(() => import('./modules/Ressources/VideoDetail'));
const TrouverPharmacie = lazy(() => import('./modules/Ressources/TrouverPharmacie'));
const RessourcesArticles = lazy(() => import('./modules/Ressources/Articles'));
const ArticleDetailPage = lazy(() => import('./modules/Ressources/ArticleDetailPage'));
const Theses = lazy(() => import('./modules/Ressources/Theses'));
const TheseDetail = lazy(() => import('./modules/Ressources/TheseDetailPage'));
const ThesePdfViewer = lazy(() => import('./modules/Ressources/ThesePdfViewer'));
const Decrets = lazy(() => import('./modules/Ressources/Decrets'));
const DecretDetail = lazy(() => import('./modules/Ressources/DecretDetailPage'));
const Decisions = lazy(() => import('./modules/Ressources/Decisions'));
const DecisionDetail = lazy(() => import('./modules/Ressources/DecisionDetailPage'));
const Commissions = lazy(() => import('./modules/Ressources/Commissions'));
const CommissionDetail = lazy(() => import('./modules/Ressources/CommissionDetailPage'));
const Lois = lazy(() => import('./modules/Ressources/Lois'));
const LoiDetail = lazy(() => import('./modules/Ressources/LoiDetailPage'));
const RessourcesUnifiees = lazy(() => import('./modules/Ressources/RessourcesUnifiees'));

// L'Ordre
const AProposOrdre = lazy(() => import('./modules/Ordre/APropos'));
const Organigramme = lazy(() => import('./modules/Ordre/Organigramme'));
const ConseilNational = lazy(() => import('./modules/Ordre/ConseilNational'));
const SantePublique = lazy(() => import('./modules/Ordre/SantePublique'));
const DefenseProfessionnelle = lazy(() => import('./modules/Ordre/DefenseProfessionnelle'));

// Membres
const TableauOrdre = lazy(() => import('./modules/Membres/TableauOrdre'));
const SectionA = lazy(() => import('./modules/Membres/SectionA'));
const SectionB = lazy(() => import('./modules/Membres/SectionB'));
const SectionC = lazy(() => import('./modules/Membres/SectionC'));
const SectionD = lazy(() => import('./modules/Membres/SectionD'));

// Pratique
const FormationContinue = lazy(() => import('./modules/Pratique/FormationContinue'));
const FormationContinueDetail = lazy(() => import('./modules/Pratique/FormationContinueDetail'));
const Deontologie = lazy(() => import('./modules/Pratique/Deontologie'));
const Pharmacies = lazy(() => import('./modules/Pratique/Pharmacies'));
const ContactPratique = lazy(() => import('./modules/Pratique/ContactPratique'));

const MentionsLegales = lazy(() => import('./modules/Legal/MentionsLegales'));
const PolitiqueConfidentialite = lazy(() => import('./modules/Legal/PolitiqueConfidentialite'));
const CGU = lazy(() => import('./modules/Legal/CGU'));
const DocumentationAdmin = lazy(() => import('./modules/DocumentationAdmin/DocumentationAdmin'));
const NotFound404 = lazy(() => import('./modules/NotFound/NotFound404'));

// Lazy loading des routes Wiki
const WikiLogin = lazy(() => import('./modules/Wiki/WikiLogin'));
const WikiDashboard = lazy(() => import('./modules/Wiki/WikiDashboard'));
const WikiUsers = lazy(() => import('./modules/Wiki/WikiUsers'));
const WikiSettings = lazy(() => import('./modules/Wiki/WikiSettings'));

// Lazy loading des routes Admin (plus lourdes)
const Login = lazy(() => import('./modules/Admin/Login'));
const Dashboard = lazy(() => import('./modules/Admin/Dashboard'));
const Analytics = lazy(() => import('./modules/Admin/Analytics'));
const PharmaciesAdmin = lazy(() => import('./modules/Admin/PharmaciesAdmin'));
const PharmaciensAdmin = lazy(() => import('./modules/Admin/PharmaciensAdmin'));
const FormationsAdmin = lazy(() => import('./modules/Admin/FormationsAdmin'));
const DeontologieAdmin = lazy(() => import('./modules/Admin/DeontologieAdmin'));

// Lazy loading des routes Pharmacien
const PharmacienDashboard = lazy(() => import('./modules/Pharmacien/PharmacienDashboard'));
const PharmaciesPharmacien = lazy(() => import('./modules/Pharmacien/PharmaciesPharmacien'));
const PharmacienTheses = lazy(() => import('./modules/Pharmacien/PharmacienTheses'));
const PharmacienMessages = lazy(() => import('./modules/Pharmacien/PharmacienMessages'));
const Simulations = lazy(() => import('./modules/Admin/Simulations'));
const Articles = lazy(() => import('./modules/Admin/Articles'));
const ArticleForm = lazy(() => import('./modules/Admin/ArticleForm'));
const Calendar = lazy(() => import('./modules/Admin/Calendar'));
const IdeaBlocks = lazy(() => import('./modules/Admin/IdeaBlocks'));
const Settings = lazy(() => import('./modules/Admin/Settings'));
const Jobs = lazy(() => import('./modules/Admin/Jobs'));
const JobForm = lazy(() => import('./modules/Admin/JobForm'));
const Logs = lazy(() => import('./modules/Admin/Logs'));
const ThesesAdmin = lazy(() => import('./modules/Admin/ThesesAdmin'));
const Projects = lazy(() => import('./modules/Admin/Projects/Projects'));
const ProjectForm = lazy(() => import('./modules/Admin/Projects/ProjectForm'));
const PageMocks = lazy(() => import('./modules/Admin/PageMocks'));
const ContactMessagesAdmin = lazy(() => import('./modules/Admin/ContactMessagesAdmin'));

// Composant de chargement
const LoadingSpinner = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '50vh',
    gap: '16px',
  }}>
    <svg width="44" height="44" viewBox="0 0 44 44" style={{ animation: 'onpg-spin 0.9s linear infinite' }}>
      <style>{`@keyframes onpg-spin { to { transform: rotate(360deg); } }`}</style>
      <circle cx="22" cy="22" r="18" fill="none" stroke="#e8f5ee" strokeWidth="4"/>
      <path d="M22 4a18 18 0 0118 18" fill="none" stroke="#00A651" strokeWidth="4" strokeLinecap="round"/>
    </svg>
    <span style={{ fontSize: '13px', color: '#00A651', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
      Chargement…
    </span>
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
            <Route path="/admin/pharmacies" element={<PharmaciesAdmin />} />
            <Route path="/admin/pharmaciens" element={<PharmaciensAdmin />} />
            <Route path="/admin/formations" element={<FormationsAdmin />} />
            <Route path="/admin/deontologie" element={<DeontologieAdmin />} />
            <Route path="/admin/messages" element={<ContactMessagesAdmin />} />

            {/* Routes Pharmacien (sans Layout) */}
            <Route path="/pharmacien/dashboard" element={<PharmacienDashboard />} />
            <Route path="/pharmacien/pharmacies" element={<PharmaciesPharmacien />} />
            <Route path="/pharmacien/theses" element={<PharmacienTheses />} />
            <Route path="/pharmacien/messages" element={<PharmacienMessages />} />
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
            <Route path="/admin/theses" element={<ThesesAdmin />} />
            <Route path="/admin/settings" element={<Settings />} />
            <Route path="/admin/resources" element={<PageMocks />} />
            
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
                    {/* Centre documentaire unifié */}
                    <Route path="/ressources" element={<RessourcesUnifiees />} />
                    <Route path="/ressources/actualites" element={<RessourcesActualites />} />
                    <Route path="/ressources/actualites/:id" element={<RessourcesArticleDetail />} />
                    <Route path="/ressources/communiques" element={<Communiques />} />
                    <Route path="/ressources/communiques/:id" element={<CommuniqueDetail />} />
                    <Route path="/ressources/photos" element={<Photos />} />
                    <Route path="/ressources/photos/:id" element={<PhotoDetail />} />
                    <Route path="/ressources/videos" element={<Videos />} />
                    <Route path="/ressources/videos/:id" element={<VideoDetail />} />
                    <Route path="/trouver-pharmacie" element={<Navigate to="/pratique/pharmacies" replace />} />
                    <Route path="/pharmacies" element={<Navigate to="/pratique/pharmacies" replace />} />
                    <Route path="/ressources/articles" element={<RessourcesArticles />} />
                    <Route path="/ressources/articles/:id" element={<ArticleDetailPage />} />
                    <Route path="/ressources/theses" element={<Theses />} />
                    <Route path="/ressources/theses/:id" element={<TheseDetail />} />
                    <Route path="/ressources/theses/:id/pdf" element={<ThesePdfViewer />} />
                    <Route path="/ressources/decrets" element={<Decrets />} />
                    <Route path="/ressources/decrets/:id" element={<DecretDetail />} />
                    <Route path="/ressources/decisions" element={<Decisions />} />
                    <Route path="/ressources/decisions/:id" element={<DecisionDetail />} />
                    <Route path="/ressources/commissions" element={<Commissions />} />
                    <Route path="/ressources/commissions/:id" element={<CommissionDetail />} />
                    <Route path="/ressources/lois" element={<Lois />} />
                    <Route path="/ressources/lois/:id" element={<LoiDetail />} />

                    {/* L'Ordre */}
                    <Route path="/ordre/a-propos" element={<AProposOrdre />} />
                    <Route path="/ordre/organigramme" element={<Organigramme />} />
                    <Route path="/ordre/conseil-national" element={<ConseilNational />} />
                    <Route path="/ordre/sante-publique" element={<SantePublique />} />
                    <Route path="/ordre/defense-professionnelle" element={<DefenseProfessionnelle />} />

                    {/* Membres */}
                    <Route path="/membres/tableau-ordre" element={<TableauOrdre />} />
                    <Route path="/membres/section-a" element={<SectionA />} />
                    <Route path="/membres/section-b" element={<SectionB />} />
                    <Route path="/membres/section-c" element={<SectionC />} />
                    <Route path="/membres/section-d" element={<SectionD />} />

                    {/* Pratique */}
                    <Route path="/pratique/formation-continue" element={<FormationContinue />} />
                    <Route path="/pratique/formation-continue/:id" element={<FormationContinueDetail />} />
                    <Route path="/pratique/deontologie" element={<Deontologie />} />
                    <Route path="/pratique/pharmacies" element={<Pharmacies />} />
                    <Route path="/pratique/contact" element={<ContactPratique />} />
                    {/* Redirections de compatibilité — routes parentes sans page propre */}
                    <Route path="/ordre"   element={<Navigate to="/ordre/a-propos"              replace />} />
                    <Route path="/membres" element={<Navigate to="/membres/tableau-ordre"        replace />} />
                    <Route path="/pratique" element={<Navigate to="/pratique/formation-continue" replace />} />
                    <Route path="/contact" element={<Navigate to="/pratique/contact"             replace />} />

                    <Route path="/mentions-legales" element={<MentionsLegales />} />
                    <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
                    <Route path="/cgu" element={<CGU />} />
                    <Route path="/documentation-admin" element={<DocumentationAdmin />} />

                    {/* 404 — doit être en dernier */}
                    <Route path="*" element={<NotFound404 />} />
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

