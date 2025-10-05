import { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import Spinner from "./components/Spinner";
import UserManagementPage from './pages/UsermanagementPage.jsx';
import DoctorsPage from './pages/DoctorsPage.jsx';
import AppointmentsPage from './pages/AppointmentsPage.jsx';
import PatientsPage from './pages/PatientsPage.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import { isAuthenticated, logout } from './utils/auth';
import RegisterPage from './pages/RegisterPage.jsx';
import DoctorDashboardPage from './pages/DoctorDashboardPage.jsx';
import axios from "axios";
import PatientDetailsPage from "./pages/PatientDetailsPage";


axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login"; // or your login route
    }
    return Promise.reject(error);
  }
);


function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" />;
}

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load user from localStorage on app start
  useEffect(() => {
    setLoading(true);
    const storedUser = localStorage.getItem('user');
    if (isAuthenticated() && storedUser) {
      try {
        let parsed = JSON.parse(storedUser);
        // Always flatten to get the actual user object and role
        if (parsed && parsed.user) {
          parsed = { ...parsed.user, token: parsed.token };
        }
        setUser(parsed);
      } catch (e) {
        console.error('Invalid user in localStorage');
        setUser(null);
        localStorage.removeItem('user');
      }
    } else {
      setUser(null);
      localStorage.removeItem('user');
    }
    setLoading(false);
  }, []);
  if (loading) return <Spinner />;
  useEffect(() => {
    const syncLogout = () => {
      if (!isAuthenticated()) setUser(null);
    };
    window.addEventListener("storage", syncLogout);
    return () => window.removeEventListener("storage", syncLogout);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
      <div className="min-h-screen flex flex-col">
        {/* Debug panel  */}
        {/*
        <div style={{ position: 'fixed', bottom: 0, right: 0, background: '#fffbe6', color: '#333', zIndex: 9999, border: '1px solid #e2e8f0', borderRadius: 8, padding: 12, fontSize: 12, maxWidth: 400 }}>
          <strong>Debug Panel</strong><br />
          <div><b>Role:</b> {user?.role?.toString() || 'N/A'}</div>
          <div><b>User:</b> <pre style={{whiteSpace:'pre-wrap',wordBreak:'break-all',margin:0}}>{JSON.stringify(user, null, 2)}</pre></div>
        </div>
        */}
        {/* Header */}
        {isAuthenticated() && (
          <header className="bg-white shadow p-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">Women's Clinic</h1>
            <nav className="space-x-4">
              <Link to="/home" className="text-gray-600 hover:text-blue-600">
                Home
              </Link>
              {user?.role?.toLowerCase() === "doctor" ? (
                <Link to="/doctors" className="text-gray-600 hover:text-blue-600">
                  Dashboard
                </Link>
              ) : (
                <Link to="/doctors" className="text-gray-600 hover:text-blue-600">
                  Doctors
                </Link>
              )}
              <Link to="/appointments" className="text-gray-600 hover:text-blue-600">
                Appointments
              </Link>
              <Link to="/patients" className="text-gray-600 hover:text-blue-600">
                Patients
              </Link>
              {user?.role?.toLowerCase() === 'admin' && (
                <Link to="/users" className="text-gray-600 hover:text-blue-600">
                  Users
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:text-white px-4 py-2 rounded ml-4"
              >
                Logout
              </button>
            </nav>
          </header>
        )}

        {/* Main content */}
        <main className="p-4 flex-grow bg-gray-100">
          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated() ? <Navigate to="/home" /> : <Navigate to="/login" />
              }
            />
            <Route path="/login" element={<LoginPage setUser={setUser} />} />
            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <HomePage user={user} />
                </PrivateRoute>
              }
            />
            <Route
              path="/doctors"
              element={
                <PrivateRoute>
                  {user?.role?.toLowerCase() === "doctor"
                    ? <DoctorDashboardPage doctorId={user?.doctorId} />
                    : <DoctorsPage user={user} />}
                </PrivateRoute>
              }
            />
            <Route
              path="/appointments"
              element={
                <PrivateRoute>
                  <AppointmentsPage user={user} />
                </PrivateRoute>
              }
            />
            <Route
              path="/patients"
              element={
                <PrivateRoute>
                  <PatientsPage user={user} />
                </PrivateRoute>
              }
            />
            <Route
              path="/users"
              element={
                  isAuthenticated() && user?.role?.toLowerCase() === 'admin' ? (
                    <UserManagementPage />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
            <Route 
              path="/patients/:id" 
              element=
              {<PatientDetailsPage />} />
           
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-gray-100 text-center text-gray-600 py-4">
          © {new Date().getFullYear()} Women’s Clinic. All rights reserved.
        </footer>
      </div>
  );
}

export default App;
