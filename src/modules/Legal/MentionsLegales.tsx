import './Legal.css';

const MentionsLegales = () => {
  return (
    <div className="legal-page">
      <section className="legal-hero">
        <div className="container">
          <h1>Mentions Légales</h1>
        </div>
      </section>

      <section className="legal-content">
        <div className="container">
          <div className="legal-section">
            <h2>Éditeur du site</h2>
            <p><strong>Ordre National des Pharmaciens du Gabon (ONPG)</strong></p>
            <p><strong>Forme juridique :</strong> Ordre professionnel régi par la loi gabonaise</p>
            <p><strong>Siège social :</strong> CC4J+WC6, Après le Ministère de la Promotion de la Bonne Gouvernance, Montée Louis, Libreville, Gabon</p>
            <p><strong>Téléphone :</strong> <a href="tel:+24176502032">076 50 20 32</a></p>
            <p><strong>Adresse e-mail :</strong> <a href="mailto:contact@onpg.ga">contact@onpg.ga</a></p>
            <p><strong>Site web :</strong> <a href="https://www.onpg.ga" target="_blank" rel="noopener noreferrer">https://www.onpg.ga</a></p>
          </div>

          <div className="legal-section">
            <h2>Directeur de la publication</h2>
            <p>
              Le directeur de la publication est le Président du Conseil National de l'Ordre National des Pharmaciens du Gabon (ONPG).
            </p>
          </div>

          <div className="legal-section">
            <h2>Développement et conception</h2>
            <p>
              Ce site web a été développé et conçu par <strong>Hexahub</strong>, société spécialisée dans le développement
              web et les solutions numériques pour les organisations professionnelles.
            </p>
            <p>
              Pour toute question technique concernant le site, vous pouvez contacter Hexahub à l'adresse :
              <a href="mailto:contact@hexahub.ga"> contact@hexahub.ga</a>
            </p>
          </div>

          <div className="legal-section">
            <h2>Hébergement</h2>
            <p>Le site est hébergé par :</p>
            <p><strong>Railway Corp.</strong></p>
            <p>340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</p>
            <p>Site web : <a href="https://railway.app" target="_blank" rel="noopener noreferrer">https://railway.app</a></p>
          </div>

          <div className="legal-section">
            <h2>Propriété intellectuelle</h2>
            <p>
              L'ensemble des éléments présents sur ce site (textes, images, graphismes, logo, icônes, sons, logiciels, etc.)
              est la propriété exclusive de l'Ordre National des Pharmaciens du Gabon (ONPG) ou fait l'objet d'une autorisation d'utilisation.
            </p>
            <p>
              Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments du site,
              quel que soit le moyen ou le procédé utilisé, est interdite sans l'autorisation écrite préalable de l'ONPG.
            </p>
            <p>
              Le design et le développement technique du site sont la propriété d'<strong>Hexahub</strong>.
            </p>
          </div>

          <div className="legal-section">
            <h2>Responsabilité</h2>
            <p>
              L'ONPG met tout en œuvre pour fournir sur son site des informations précises et à jour. Toutefois, l'Ordre ne saurait
              être tenu responsable des omissions, inexactitudes ou carences dans la mise à jour.
            </p>
            <p>L'utilisateur reconnaît utiliser le site sous sa responsabilité exclusive.</p>
            <p>
              L'ONPG ne peut être tenu responsable des dommages directs ou indirects causés par l'utilisation du site ou de l'impossibilité
              d'y accéder.
            </p>
          </div>

          <div className="legal-section">
            <h2>Protection des données personnelles</h2>
            <p>
              Les informations recueillies sur ce site sont destinées à l'ONPG et sont utilisées uniquement à des fins de gestion de
              la relation avec les membres et les visiteurs du site.
            </p>
            <p>
              Conformément à la réglementation en vigueur, vous disposez d'un droit d'accès, de rectification et de suppression de
              vos données personnelles.
            </p>
            <p>
              Pour exercer ce droit, vous pouvez écrire à : <a href="mailto:contact@onpg.ga">contact@onpg.ga</a>
            </p>
            <p>
              Pour plus d'informations, consultez notre <a href="/politique-confidentialite">Politique de Confidentialité</a>.
            </p>
          </div>

          <div className="legal-section">
            <h2>Cookies</h2>
            <p>
              Le site peut être amené à utiliser des cookies afin d'améliorer l'expérience utilisateur et les services proposés.
            </p>
            <p>L'utilisateur peut configurer son navigateur pour refuser les cookies.</p>
            <p>
              Pour plus d'informations sur l'utilisation des cookies, consultez notre <a href="/politique-confidentialite">Politique de Confidentialité</a>.
            </p>
          </div>

          <div className="legal-section">
            <h2>Liens externes</h2>
            <p>
              Le site peut contenir des liens vers d'autres sites web. L'ONPG n'exerce aucun contrôle sur ces sites et décline toute
              responsabilité quant à leur contenu ou leur accessibilité.
            </p>
          </div>

          <div className="legal-section">
            <h2>Droit applicable</h2>
            <p>Les présentes mentions légales sont régies par le droit gabonais.</p>
            <p>En cas de litige, les tribunaux compétents de Libreville, République Gabonaise, seront seuls compétents.</p>
          </div>

          <div className="legal-section">
            <h2>Contact</h2>
            <p>Pour toute question concernant les présentes mentions légales, vous pouvez contacter l'ONPG :</p>
            <p><strong>Ordre National des Pharmaciens du Gabon</strong></p>
            <p>CC4J+WC6, Après le Ministère de la Promotion de la Bonne Gouvernance, Montée Louis, Libreville, Gabon</p>
            <p>Téléphone : <a href="tel:+24176502032">076 50 20 32</a></p>
            <p>Email : <a href="mailto:contact@onpg.ga">contact@onpg.ga</a></p>
          </div>

          <div className="legal-update-date">
            <p><em>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</em></p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MentionsLegales;
