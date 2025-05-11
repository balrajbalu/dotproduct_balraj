/**
 * UI components adapted from Material UI Free Templates.
 * Reference: https://mui.com/store/#free-templates
 * Minor design and logic changes applied.
 */
/**
 * D3 chart logic referenced from D3 Gallery examples.
 * Source: https://observablehq.com/@d3/gallery
 * Custom modifications included for project-specific interactivity and data.
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import TransactionsPage from './pages/TransactionsPage';
import NotFound from './pages/NotFound';
import Categories from './pages/CategoriesPage';
import BudgetPage from './pages/BudgetPage';
import { useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
function App() {
  const PrivateRoute = ({ children }) => {
    const { token } = useAuth();
    return token ? children : <Navigate to="/" />;
  };
  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/dashboard' element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path='/transaction' element={<PrivateRoute><TransactionsPage /></PrivateRoute>} />
          <Route path='/categories' element={<PrivateRoute><Categories /></PrivateRoute>} />
          <Route path='/budget' element={<PrivateRoute><BudgetPage /></PrivateRoute>} />
          <Route path="*" element={<PrivateRoute><NotFound /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
