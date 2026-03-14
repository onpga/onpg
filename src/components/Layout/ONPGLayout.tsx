import { ReactNode } from 'react';
import NavbarONPG from '../Navbar/NavbarONPG';
import FooterONPG from '../Footer/FooterONPG';

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
    </div>
  );
};

export default ONPGLayout;
