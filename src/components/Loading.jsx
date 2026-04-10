import React from 'react';
import { Spinner, Container } from 'react-bootstrap';
import './Loading.css';

const Loading = ({
  message = 'Cargando...',
  fullScreen = false,
  animation = 'border',
  size = null
}) => {
  if (fullScreen) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <Spinner animation={animation} role="status" size={size}>
            <span className="visually-hidden">{message}</span>
          </Spinner>
          <p className="mt-3">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <Container className="text-center py-5">
      <Spinner animation={animation} role="status">
        <span className="visually-hidden">{message}</span>
      </Spinner>
      <p className="mt-3">{message}</p>
    </Container>
  );
};

export default Loading;
