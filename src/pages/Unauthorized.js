import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="container mt-5 text-center">
      <div className="alert alert-danger">
        <h2>Acesso Não Autorizado</h2>
        <p>Você não tem permissão para acessar esta página.</p>
        <Link to="/" className="btn btn-primary mt-3">
          Voltar para a página inicial
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;