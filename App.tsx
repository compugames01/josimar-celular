/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Registro from './pages/Registro';
import Login from './pages/Login';
import About from './pages/About';
import Programs from './pages/Programs';
import Settings from './pages/Settings';
import RecuperarPassword from './pages/RecuperarPassword';
import CambiarPassword from './pages/CambiarPassword';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/nosotros" element={<About />} />
        <Route path="/programas" element={<Programs />} />
        <Route 
          path="/ajuste" 
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } 
        />
        <Route path="/recuperar-password" element={<RecuperarPassword />} />
        <Route path="/cambiar-password" element={<CambiarPassword />} />
      </Routes>
    </Router>
  );
}
