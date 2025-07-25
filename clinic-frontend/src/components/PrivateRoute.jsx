// components/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

export default function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" />;
}
