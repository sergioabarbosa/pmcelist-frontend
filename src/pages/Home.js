import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container mt-5">
      <div className="jumbotron">
        <h1 className="display-4">Bem-vindo ao Sistema de Gestão de Setores da PMCE</h1>
        <p className="lead">
          Este sistema permite consultar e gerenciar os setores da Polícia Militar do Ceará.
        </p>
        <hr className="my-4" />
        <p>
          Acesse a lista de setores para visualizar informações detalhadas sobre batalhões, 
          companhias, comandantes, telefones e AIS.
        </p>
        <Link to="/sectors" className="btn btn-primary btn-lg">
          Ver Setores
        </Link>
      </div>
    </div>
  );
};

export default Home;