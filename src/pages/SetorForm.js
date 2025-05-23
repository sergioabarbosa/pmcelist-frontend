import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { getSetorById, createSetor, updateSetor } from '../services/api';

const SetorSchema = Yup.object().shape({
  battalion: Yup.string().required('Batalhão/Companhia é obrigatório'),
  commander: Yup.string().required('Nome do comandante é obrigatório'),
  phone: Yup.string().required('Telefone é obrigatório'),
  ais: Yup.string().required('AIS é obrigatório'),
});

const SetorForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [setor, setSetor] = useState(null);
  const [loading, setLoading] = useState(id ? true : false);
  const [error, setError] = useState('');
  const isEditMode = !!id;

  const fetchSetor = useCallback(async () => {
    try {
      const data = await getSetorById(id);
      setSetor(data);
    } catch (err) {
      setError('Erro ao carregar os dados do setor. Por favor, tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (isEditMode) {
      fetchSetor();
    }
  }, [isEditMode, fetchSetor]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (isEditMode) {
        await updateSetor(id, values);
      } else {
        await createSetor(values);
      }
      navigate('/setores');
    } catch (err) {
      setError('Erro ao salvar o setor. Por favor, tente novamente.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Carregando...</div>;
  }

  const initialValues = isEditMode
    ? setor
    : {
        battalion: '',
        commander: '',
        phone: '',
        ais: '',
      };

  return (
    <div className="container mt-4">
      <h2>{isEditMode ? 'Editar Setor' : 'Novo Setor'}</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="card">
        <div className="card-body">
          <Formik
            initialValues={initialValues}
            validationSchema={SetorSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="mb-3">
                  <label htmlFor="battalion" className="form-label">
                    Batalhão/Companhia
                  </label>
                  <Field
                    type="text"
                    name="battalion"
                    className="form-control"
                    id="battalion"
                  />
                  <ErrorMessage
                    name="battalion"
                    component="div"
                    className="text-danger"
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="commander" className="form-label">
                    Comandante
                  </label>
                  <Field
                    type="text"
                    name="commander"
                    className="form-control"
                    id="commander"
                  />
                  <ErrorMessage
                    name="commander"
                    component="div"
                    className="text-danger"
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">
                    Telefone
                  </label>
                  <Field
                    type="text"
                    name="phone"
                    className="form-control"
                    id="phone"
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="text-danger"
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="ais" className="form-label">
                    AIS
                  </label>
                  <Field
                    type="text"
                    name="ais"
                    className="form-control"
                    id="ais"
                  />
                  <ErrorMessage
                    name="ais"
                    component="div"
                    className="text-danger"
                  />
                </div>
                
                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Salvando...' : 'Salvar'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate('/setores')}
                  >
                    Cancelar
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default SetorForm;