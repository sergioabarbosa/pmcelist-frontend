import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import SetoresList from './pages/SetoresList';
import SetorForm from './pages/SetorForm';
import Unauthorized from './pages/Unauthorized';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main className="py-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/setores" element={<SetoresList />} />
            <Route 
              path="/setores/novo" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <SetorForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/setores/editar/:id" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <SetorForm />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;
