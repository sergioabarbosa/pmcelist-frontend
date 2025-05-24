import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getSetores, deleteSetor } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const SetoresList = () => {
  const [setores, setSetores] = useState([]);
  const [filteredSetores, setFilteredSetores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterField, setFilterField] = useState('all');
  const [expandedRows, setExpandedRows] = useState({});
  const { user } = useContext(AuthContext);
  
  // Force isAdmin to true for development/testing
  const isAdmin = true; // This will make the CRUD buttons visible
  
  useEffect(() => {
    // Allow fetching sectors for all users, including non-logged in users
    fetchSetores();
  }, []);

  useEffect(() => {
    filterSetores();
  }, [searchTerm, filterField, setores]);

  const fetchSetores = async () => {
    try {
      setLoading(true);
      const data = await getSetores();
      setSetores(data);
      setFilteredSetores(data);
      setError('');
    } catch (err) {
      setError('Erro ao carregar os setores. Por favor, tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterSetores = () => {
    if (!searchTerm.trim()) {
      setFilteredSetores(setores);
      return;
    }

    const term = searchTerm.toLowerCase().trim();
    
    const filtered = setores.filter(setor => {
      if (filterField === 'all') {
        return (
          (setor.battalion && setor.battalion.toLowerCase().includes(term)) ||
          (setor.commander && setor.commander.toLowerCase().includes(term)) ||
          (setor.phone && setor.phone.toLowerCase().includes(term)) ||
          (setor.ais && setor.ais.toLowerCase().includes(term))
        );
      }
      
      return setor[filterField] && setor[filterField].toLowerCase().includes(term);
    });
    
    setFilteredSetores(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterFieldChange = (e) => {
    setFilterField(e.target.value);
  };

  const handleDelete = async (id) => {
    // Remove the user check since we're forcing isAdmin to true for testing
    if (window.confirm('Tem certeza que deseja excluir este setor?')) {
      try {
        await deleteSetor(id);
        setSetores(setores.filter((setor) => setor._id !== id));
      } catch (err) {
        setError(err.message || 'Erro ao excluir o setor. Por favor, tente novamente.');
        console.error(err);
      }
    }
  };

  const toggleRowExpansion = (id) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (loading) {
    return <div className="text-center mt-5">Carregando...</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Setores da PMCE</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      
      {isAdmin && (
        <Link to="/setores/novo" className="btn btn-primary mb-3">
          Adicionar Novo Setor
        </Link>
      )}
      
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Filtrar Setores</h5>
          <div className="row g-3">
            <div className="col-md-8">
              <input
                type="text"
                className="form-control"
                placeholder="Digite para pesquisar..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div className="col-md-4">
              <select 
                className="form-select" 
                value={filterField}
                onChange={handleFilterFieldChange}
              >
                <option value="all">Todos os campos</option>
                <option value="battalion">Batalhão/Companhia</option>
                <option value="commander">Comandante</option>
                <option value="phone">Telefone</option>
                <option value="ais">AIS</option>
              </select>
            </div>
          </div>
          {filteredSetores.length === 0 && searchTerm && (
            <div className="alert alert-info mt-3 mb-0">
              Nenhum resultado encontrado para "{searchTerm}"
            </div>
          )}
        </div>
      </div>
      
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th style={{ width: '40px' }}></th>
              <th>Batalhão/Companhia</th>
              <th>Comandante</th>
              <th>Telefone</th>
              <th>AIS</th>
              {isAdmin && <th>Ações</th>}
            </tr>
          </thead>
          <tbody>
            {filteredSetores.length > 0 ? (
              filteredSetores.map((setor) => (
                <React.Fragment key={setor._id}>
                  <tr>
                    <td>
                      <button 
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => toggleRowExpansion(setor._id)}
                        aria-expanded={expandedRows[setor._id]}
                      >
                        {expandedRows[setor._id] ? '−' : '+'}
                      </button>
                    </td>
                    <td>{setor.battalion}</td>
                    <td>{setor.commander}</td>
                    <td>{setor.phone}</td>
                    <td>{setor.ais}</td>
                    {isAdmin && (
                      <td>
                        <Link
                          to={`/setores/editar/${setor._id}`}
                          className="btn btn-sm btn-warning me-2"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => handleDelete(setor._id)}
                          className="btn btn-sm btn-danger"
                        >
                          Excluir
                        </button>
                      </td>
                    )}
                  </tr>
                  {expandedRows[setor._id] && (
                    <tr>
                      <td colSpan={isAdmin ? 6 : 5}>
                        <div className="p-3 bg-light">
                          <h6 className="mb-3">Unidades Subordinadas</h6>
                          {setor.subitems && setor.subitems.length > 0 ? (
                            <table className="table table-sm table-bordered">
                              <thead className="table-secondary">
                                <tr>
                                  <th>Nome</th>
                                  <th>Endereço</th>
                                  <th>Telefone</th>
                                </tr>
                              </thead>
                              <tbody>
                                {setor.subitems.map(item => (
                                  <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>{item.address}</td>
                                    <td>{item.phone}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <p className="text-muted mb-0">Nenhuma unidade subordinada cadastrada.</p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={isAdmin ? 6 : 5} className="text-center">
                  Nenhum setor encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SetoresList;