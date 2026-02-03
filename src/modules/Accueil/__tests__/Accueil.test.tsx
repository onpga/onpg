import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Accueil from '../Accueil';
import axios from 'axios';

vi.mock('axios');

describe('Accueil', () => {
  it('devrait afficher la page d\'accueil', async () => {
    const mockData = {
      data: {
        success: true,
        data: {
          hero: {
            title: 'Test Title',
            subtitle: 'Test Subtitle',
            buttons: []
          },
          services: {
            energie: { title: 'Énergie', description: 'Test' },
            environnement: { title: 'Environnement', description: 'Test' },
            numerique: { title: 'Numérique', description: 'Test' }
          },
          about: {
            title: 'Qui sommes-nous ?',
            description: 'Test',
            text: 'Test',
            ambition: 'Test',
            link: '/apropos'
          }
        }
      }
    };

    (axios.get as any).mockResolvedValue(mockData);

    render(<Accueil />);

    // Vérifier que les éléments sont présents
    expect(await screen.findByText('Test Title')).toBeInTheDocument();
  });
});

