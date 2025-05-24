import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSetorById, createSetor, updateSetor } from '../services/api';

const SetorForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    battalion: '',
    commander: '',
    phone: '',
    ais: '',
    subitems: []
  });
  const [loading, setLoading] = useState(id ? true : false);
  const [error, setError] = useState('');
  const [subitemForm, setSubitemForm] = useState({ name: '', address: '', phone: '' });
  
  const isEditMode = !!id;

  useEffect(() => {
    if (isEditMode) {
      fetchSetor();
    }
  }, [id]);

  const fetchSetor = async () => {
    try {
      setLoading(true);
      const data = await getSetorById(id);
      if (data) {
        setFormData({
          battalion: data.battalion || '',
          commander: data.commander || '',
          phone: data.phone || '',
          ais: data.ais || '',
          subitems: data.subitems || []
        });
      }
    } catch (err) {
      setError('Erro ao carregar o setor. Por favor, tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubitemChange = (e) => {
    const { name, value } = e.target;
    setSubitemForm(prev => ({ ...prev, [name]: value }));
  };

  const addSubitem = () => {
    if (!subitemForm.name) {
      setError('O nome da unidade subordinada é obrigatório.');
      return;
    }
    
    const newSubitem = {
      id: Date.now().toString(), // Generate a temporary ID
      ...subitemForm
    };
    
    setFormData(prev => ({
      ...prev,
      subitems: [...prev.subitems, newSubitem]
    }));
    
    // Reset subitem form
    setSubitemForm({ name: '', address: '', phone: '' });
  };

  const removeSubitem = (id) => {
    setFormData(prev => ({
      ...prev,
      subitems: prev.subitems.filter(item => item.id !== id)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      if (isEditMode) {
        await updateSetor(id, formData);
      } else {
        await createSetor(formData);
      }
      
      navigate('/setores');
    } catch (err) {
      setError(err.message || 'Erro ao salvar o setor. Por favor, tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Carregando...</div>;
  }

  return (
    <div className="container mt-4">
      <h2>{isEditMode ? 'Editar Setor' : 'Novo Setor'}</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Informações do Setor</h5>
            
            <div className="mb-3">
              <label htmlFor="battalion" className="form-label">Batalhão/Companhia</label>
              <input
                type="text"
                className="form-control"
                id="battalion"
                name="battalion"
                value={formData.battalion}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="commander" className="form-label">Comandante</label>
              <input
                type="text"
                className="form-control"
                id="commander"
                name="commander"
                value={formData.commander}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">Telefone</label>
              <input
                type="text"
                className="form-control"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="ais" className="form-label">AIS</label>
              <input
                type="text"
                className="form-control"
                id="ais"
                name="ais"
                value={formData.ais}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Unidades Subordinadas</h5>
            
            {formData.subitems.length > 0 ? (
              <table className="table table-sm table-bordered mb-4">
                <thead className="table-secondary">
                  <tr>
                    <th>Nome</th>
                    <th>Endereço</th>
                    <th>Telefone</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.subitems.map(item => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.address}</td>
                      <td>{item.phone}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => removeSubitem(item.id)}
                        >
                          Remover
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-muted mb-4">Nenhuma unidade subordinada cadastrada.</p>
            )}
            
            <h6>Adicionar Nova Unidade</h6>
            <div className="row g-3">
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nome"
                  name="name"
                  value={subitemForm.name}
                  onChange={handleSubitemChange}
                />
              </div>
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Endereço"
                  name="address"
                  value={subitemForm.address}
                  onChange={handleSubitemChange}
                />
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Telefone"
                  name="phone"
                  value={subitemForm.phone}
                  onChange={handleSubitemChange}
                />
              </div>
              <div className="col-md-1">
                <button
                  type="button"
                  className="btn btn-primary w-100"
                  onClick={addSubitem}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/setores')}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default SetorForm;