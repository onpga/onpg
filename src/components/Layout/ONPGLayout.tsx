import { ReactNode } from 'react';
import NavbarONPG from '../Navbar/NavbarONPG';
import FooterONPG from '../Footer/FooterONPG';
import ScrollToTop from '../ScrollToTop';

interface ONPGLayoutProps {
  children: ReactNode;
}

const ONPGLayout = ({ children }: ONPGLayoutProps) => {
  return (
    <div className="onpg-layout">
      <NavbarONPG />
      <main className="onpg-main-content">
        {children}
      </main>
      <FooterONPG />
      <ScrollToTop />
    </div>
  );
};

export default ONPGLayout;
