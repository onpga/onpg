import { Link } from 'react-router-dom';
import './AboutPreview.css';

interface AboutPreviewProps {
  aboutData: {
    title: string;
    description: string;
    text: string;
    ambition: string;
    link: string;
  };
}

const AboutPreview = ({ aboutData }: AboutPreviewProps) => {
  return (
    <section className="section about-preview-section">
      <div className="container">
        <h2>{aboutData.title}</h2>
        <div className="about-preview-content">
          <div className="about-preview-main">
            <h3 className="about-preview-company-name">{aboutData.description}</h3>
            <p>{aboutData.text}</p>
            <p className="about-preview-ambition">{aboutData.ambition}</p>
            <Link to={aboutData.link} className="btn btn-secondary">
              En savoir plus →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;
