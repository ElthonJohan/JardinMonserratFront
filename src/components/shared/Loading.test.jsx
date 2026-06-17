import React from 'react';
import { render, screen } from '@testing-library/react';
import Loading from './Loading';

describe('Loading Component', () => {
  it('debe renderizar el mensaje por defecto "Cargando..."', () => {
    render(<Loading />);
    expect(screen.getAllByText('Cargando...')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Cargando...')).toHaveLength(2);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('debe renderizar un mensaje personalizado', () => {
    const customMessage = 'Obteniendo datos...';
    render(<Loading message={customMessage} />);
    expect(screen.getAllByText(customMessage)[0]).toBeInTheDocument();
    expect(screen.getAllByText(customMessage)).toHaveLength(2);
  });

  it('debe aplicar la clase de pantalla completa cuando fullScreen es true', () => {
    const { container } = render(<Loading fullScreen={true} />);
    const loadingScreen = container.querySelector('.loading-screen');
    expect(loadingScreen).toBeInTheDocument();
    expect(loadingScreen).toHaveClass('loading-screen');
  });
});
