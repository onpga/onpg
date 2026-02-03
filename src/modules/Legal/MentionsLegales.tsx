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
            <h2>Raison sociale</h2>
            <p><strong>CIPS</strong></p>
            <p><strong>Forme juridique :</strong> Société à Responsabilité Limitée (SARL)</p>
            <p><strong>Capital social :</strong> 1 000 000 000 FCFA</p>
            <p><strong>Numéro RCCM :</strong> GA-LBV-01-2023-813-00260</p>
            <p><strong>Numéro NIF :</strong> 202301007971 K</p>
          </div>

          <div className="legal-section">
            <h2>Siège social</h2>
            <p>Akanda, Carrefour Jiji – Libreville, Gabon</p>
            <p><strong>Téléphone :</strong> +241 60 22 74 74 / +241 74 80 23 44</p>
            <p><strong>Adresse e-mail :</strong> <a href="mailto:contact@cips-tech.ga">contact@cips-tech.ga</a></p>
          </div>

          <div className="legal-section">
            <h2>Hébergement</h2>
            <p>Le site est hébergé par :</p>
            <p><em>[Nom de l'hébergeur à compléter]</em></p>
            <p><em>Adresse : [adresse complète de l'hébergeur]</em></p>
            <p><em>Téléphone : [numéro de l'hébergeur]</em></p>
            <p><em>Site web : [URL de l'hébergeur]</em></p>
          </div>

          <div className="legal-section">
            <h2>Propriété intellectuelle</h2>
            <p>
              L'ensemble des éléments présents sur ce site (textes, images, graphismes, logo, icônes, sons, logiciels, etc.) 
              est la propriété exclusive de CIPS ou fait l'objet d'une autorisation d'utilisation.
            </p>
            <p>
              Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments du site, 
              quel que soit le moyen ou le procédé utilisé, est interdite sans l'autorisation écrite préalable de CIPS.
            </p>
          </div>

          <div className="legal-section">
            <h2>Responsabilité</h2>
            <p>
              CIPS met tout en œuvre pour fournir sur son site des informations précises et à jour. Toutefois, la société ne saurait 
              être tenue responsable des omissions, inexactitudes ou carences dans la mise à jour, qu'elles soient de son fait ou du 
              fait de tiers partenaires.
            </p>
            <p>L'utilisateur reconnaît utiliser le site sous sa responsabilité exclusive.</p>
          </div>

          <div className="legal-section">
            <h2>Protection des données personnelles</h2>
            <p>
              Les informations recueillies sur ce site sont destinées à CIPS et sont utilisées uniquement à des fins de gestion de 
              la relation client.
            </p>
            <p>
              Conformément à la réglementation en vigueur, vous disposez d'un droit d'accès, de rectification et de suppression de 
              vos données personnelles.
            </p>
            <p>
              Pour exercer ce droit, vous pouvez écrire à : <a href="mailto:contact@cips-tech.ga">contact@cips-tech.ga</a>
            </p>
          </div>

          <div className="legal-section">
            <h2>Cookies</h2>
            <p>
              Le site peut être amené à utiliser des cookies afin d'améliorer l'expérience utilisateur et les services proposés.
            </p>
            <p>L'utilisateur peut configurer son navigateur pour refuser les cookies.</p>
          </div>

          <div className="legal-section">
            <h2>Droit applicable</h2>
            <p>Les présentes mentions légales sont régies par le droit gabonais.</p>
            <p>En cas de litige, les tribunaux compétents de Libreville seront seuls compétents.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MentionsLegales;

