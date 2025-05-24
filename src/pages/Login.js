import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { jwtDecode } from 'jwt-decode';
import { login } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Email inválido').required('Email é obrigatório'),
  password: Yup.string().required('Senha é obrigatória'),
});

const Login = () => {
  const [error, setError] = useState('');
  const { login: authLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const data = await login(values);
      
      console.log('Login response:', data);
      
      // Para autenticação mock
      if (data.token === 'mock-jwt-token') {
        console.log('Mock login - user data:', data.user);
        authLogin(data.token, data.user);
        navigate('/sectors');
        return;
      }
      
      // Para autenticação real com backend
      console.log('Real login - token:', data.token);
      
      let userData = null;
      
      // Verifica se o backend já retorna os dados completos do usuário
      if (data.user && typeof data.user === 'object') {
        console.log('Using complete user data from login response:', data.user);
        userData = data.user;
      } else {
        // Se não tem dados completos, decodifica o JWT
        try {
          const decoded = jwtDecode(data.token);
          console.log('Decoded JWT:', decoded);
          
          // Extrai os dados do JWT decodificado
          // Verifica diferentes possíveis estruturas do JWT
          userData = {
            _id: decoded._id || decoded.id || decoded.sub,
            id: decoded._id || decoded.id || decoded.sub,
            email: decoded.email,
            // Verifica diferentes formas de determinar se é admin
            isAdmin: decoded.isAdmin || decoded.admin || decoded.role === 'admin' || decoded.role === 'ADMIN' || false,
            // Adicione outros campos conforme necessário
            name: decoded.name,
            role: decoded.role
          };
          
          console.log('JWT decoded fields:', {
            isAdmin: decoded.isAdmin,
            admin: decoded.admin,
            role: decoded.role,
            allFields: Object.keys(decoded)
          });
          
          console.log('Constructed user data from JWT:', userData);
          
          // TEMPORÁRIO: Force admin para desenvolvimento (REMOVER EM PRODUÇÃO)
          if (process.env.NODE_ENV === 'development') {
            userData.isAdmin = true;
            console.log('DEVELOPMENT: Forcing isAdmin to true');
          }
          
          // Se ainda não temos um ID válido, algo está errado
          if (!userData._id && !userData.id) {
            throw new Error('JWT não contém ID do usuário válido');
          }
          
        } catch (decodeError) {
          console.error('Error decoding JWT:', decodeError);
          throw new Error('Token inválido recebido do servidor');
        }
      }
      
      // Faz o login com os dados do usuário
      authLogin(data.token, userData);
      navigate('/sectors');
      
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Credenciais inválidas. Por favor, tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">Login</h4>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={LoginSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">
                        Email
                      </label>
                      <Field
                        type="email"
                        name="email"
                        className="form-control"
                        id="email"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">
                        Senha
                      </label>
                      <Field
                        type="password"
                        name="password"
                        className="form-control"
                        id="password"
                      />
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Entrando...' : 'Entrar'}
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;