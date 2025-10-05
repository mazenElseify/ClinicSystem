import Select from "../components/Select";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function HomePage({ user }) {
  const role = user?.role?.toLowerCase();
  const name = user?.firstName ? `${user.firstName} ${user.lastName}` : user?.username || "User";
  const today = new Date();
  const token = localStorage.getItem("token");
  const doctorId = role === "doctor" ? user?.doctorId : undefined;
  // Modal state for Add Patient and Add Appointment
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  // Patient form state
  const initialPatient = {
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    maritalStatus: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    doctorId: doctorId || "",
  };
  const [currentPatient, setCurrentPatient] = useState(initialPatient);
  const [patientError, setPatientError] = useState("");
  // Appointment form state
  const initialAppointment = {
    appointmentDateTime: "",
    patientId: "",
    doctorId: doctorId || "",
    status: "Scheduled",
    reason: "",
    notes: "",
  };
  const [currentAppointment, setCurrentAppointment] = useState(initialAppointment);
  const [appointmentError, setAppointmentError] = useState("");

  // State for real stats
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Appointments
        let apptRes;
        if (role === "doctor" && doctorId) {
          apptRes = await axios.get(`${API_BASE_URL}/appointments/doctor/${doctorId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } else {
          apptRes = await axios.get(`${API_BASE_URL}/appointments`, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }
        setAppointments(Array.isArray(apptRes.data) ? apptRes.data : apptRes.data.data || []);
        // Patients
        let patientRes;
        if (role === "doctor" && doctorId) {
          patientRes = await axios.get(`${API_BASE_URL}/patients/doctor/${doctorId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } else {
          patientRes = await axios.get(`${API_BASE_URL}/patients`, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }
        setPatients(Array.isArray(patientRes.data) ? patientRes.data : patientRes.data.data || []);
        // Doctors (only fetch for non-doctor users)
        if (role !== "doctor") {
          const doctorRes = await axios.get(`${API_BASE_URL}/doctors`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setDoctors(Array.isArray(doctorRes.data) ? doctorRes.data : doctorRes.data.data || []);
        } else {
          setDoctors([]);
        }
      } catch (err) {
        // Optionally handle error
      }
      setLoading(false);
    };
    fetchData();
  }, [token, role, doctorId]);

  // Calculate today's appointments
  const todayAppointments = appointments.filter(appt => {
    if (!appt.appointmentDateTime) return false;
    const d = new Date(appt.appointmentDateTime);
    return d.toDateString() === today.toDateString();
  });

  // Example: Pending tasks (customize as needed)
  const pendingTasks = appointments.filter(appt => appt.status && appt.status.toLowerCase() === "scheduled").length;

  // Stats: adjust for doctor role
  let stats = [];
  if (role === "doctor") {
    stats = [
      { label: "Today's Appointments", value: todayAppointments.length, link: "/appointments" },
      { label: "Pending Tasks", value: pendingTasks, link: "/appointments" },
      { label: "My Patients", value: patients.length, link: "/patients" },
    ];
  } else {
    stats = [
      { label: "Today's Appointments", value: todayAppointments.length, link: "/appointments" },
      { label: "Pending Tasks", value: pendingTasks, link: "/appointments" },
      { label: "Patients", value: patients.length, link: "/patients" },
      { label: "Doctors", value: doctors.length, link: "/doctors" },
    ];
  }

  let quickActions = [];
  if (role === "admin") {
    quickActions = [
      { label: "Add User", to: "/users" },
      { label: "Add Doctor", to: "/doctors" },
      { label: "Add Patient", action: () => setShowPatientModal(true) },
      { label: "Add Appointment", action: () => setShowAppointmentModal(true) },
      { label: "View Today's Appointments", to: "/appointments" },
    ];
  } else if (role === "receptionist") {
    quickActions = [
      { label: "Add Patient", action: () => setShowPatientModal(true) },
      { label: "Add Appointment", action: () => setShowAppointmentModal(true) },
      { label: "View Today's Appointments", to: "/appointments" },
    ];
  } else if (role === "doctor") {
    quickActions = [
      { label: "Add Patient", action: () => setShowPatientModal(true) },
      { label: "Add Appointment", action: () => setShowAppointmentModal(true) },
      { label: "View Today's Appointments", to: "/appointments" },
    ];
  }

  // Calendar logic: highlight days with appointments
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const hasAppt = appointments.some(appt => {
        if (!appt.appointmentDateTime) return false;
        const d = new Date(appt.appointmentDateTime);
        return d.toDateString() === date.toDateString();
      });
      return hasAppt ? 'bg-blue-200 rounded-full' : null;
    }
    return null;
  };

  // Appointments for selected date
  const selectedDayAppointments = appointments.filter(appt => {
    if (!appt.appointmentDateTime) return false;
    const d = new Date(appt.appointmentDateTime);
    return d.toDateString() === selectedDate.toDateString();
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-blue-700 mb-2">Welcome, {name}!</h1>
          <div className="text-gray-600 text-lg">{today.toLocaleDateString()} | {today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
        <img src="/logo192.png" alt="Clinic Logo" className="h-16 w-16 md:ml-8" />
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 mb-8">
        {quickActions.map((action) => (
          action.action ? (
            <button
              key={action.label}
              onClick={action.action}
              className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
            >
              {action.label}
            </button>
          ) : (
            <Link
              key={action.label}
              to={action.to}
              className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
            >
              {action.label}
            </Link>
          )
        ))}
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Link
            to={stat.link}
            key={stat.label}
            className="bg-white border border-gray-200 rounded-lg shadow p-6 flex flex-col items-center hover:shadow-lg transition"
          >
            <div className="text-2xl font-bold text-blue-700 mb-1">{loading ? "..." : stat.value}</div>
            <div className="text-gray-700 text-center">{stat.label}</div>
          </Link>
        ))}
      </div>

      {/* Calendar & Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4 text-blue-600">Mini Calendar</h2>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileClassName={tileClassName}
          />
          <div className="mt-4">
            <h3 className="font-semibold text-blue-700 mb-2">Appointments on {selectedDate.toLocaleDateString()}:</h3>
            {selectedDayAppointments.length === 0 ? (
              <div className="text-gray-500">No appointments.</div>
            ) : (
              <ul className="list-disc pl-5">
                {selectedDayAppointments.map(appt => (
                  <li key={appt.id} className="mb-1">
                    {appt.appointmentDateTime.slice(11, 16)} - {appt.patientName || patients.find(p => p.id === appt.patientId)?.firstName + ' ' + patients.find(p => p.id === appt.patientId)?.lastName || 'Unknown Patient'} with {appt.doctorName || doctors.find(d => d.id === appt.doctorId)?.firstName + ' ' + doctors.find(d => d.id === appt.doctorId)?.lastName || 'Unknown Doctor'}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4 text-blue-600">Recent Activity</h2>
          <div className="text-gray-500">[Recent appointments, new patients, etc. coming soon]</div>
        </div>
      </div>

      {/* Announcements / Alerts */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mb-4">
        <div className="font-bold text-yellow-700 mb-1">Announcements</div>
        <ul className="list-disc pl-5 text-yellow-800">
          <li>System update scheduled for next week.</li>
          <li>Remember to confirm tomorrow's appointments.</li>
        </ul>
      </div>
        {/* Add Patient Modal */}
        {showPatientModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setPatientError("");
                try {
                  await axios.post(`${API_BASE_URL}/patients`, currentPatient, {
                    headers: { Authorization: `Bearer ${token}` }
                  });
                  setShowPatientModal(false);
                  setCurrentPatient(initialPatient);
                } catch (err) {
                  setPatientError("Failed to add patient");
                }
              }}
              className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
            >
              <h2 className="text-xl font-bold mb-4 text-blue-600">Add Patient</h2>
              <input name="firstName" value={currentPatient.firstName} onChange={e => setCurrentPatient({ ...currentPatient, firstName: e.target.value })} placeholder="First Name" className="w-full p-2 border rounded mb-2" required />
              <input name="lastName" value={currentPatient.lastName} onChange={e => setCurrentPatient({ ...currentPatient, lastName: e.target.value })} placeholder="Last Name" className="w-full p-2 border rounded mb-2" required />
              <input type="date" name="dateOfBirth" value={currentPatient.dateOfBirth} onChange={e => setCurrentPatient({ ...currentPatient, dateOfBirth: e.target.value })} className="w-full p-2 border rounded mb-2" required />
              <select name="gender" value={currentPatient.gender} onChange={e => setCurrentPatient({ ...currentPatient, gender: e.target.value })} className="w-full p-2 border rounded mb-2" required>
                <option value="">Select Gender</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
              {/* Doctor selection for admin/receptionist using react-select */}
              {(role === "admin" || role === "receptionist") && (
                <div className="mb-2">
                  <Select
                    options={doctors.map(doc => ({ value: doc.id, label: `${doc.firstName} ${doc.lastName} (ID: ${doc.id})` }))}
                    value={doctors.find(doc => doc.id === currentPatient.doctorId) ? { value: currentPatient.doctorId, label: `${doctors.find(doc => doc.id === currentPatient.doctorId).firstName} ${doctors.find(doc => doc.id === currentPatient.doctorId).lastName} (ID: ${currentPatient.doctorId})` } : null}
                    onChange={option => setCurrentPatient({ ...currentPatient, doctorId: option ? option.value : "" })}
                    placeholder="Search doctor by name or ID"
                    isClearable
                  />
                </div>
              )}
              {/* Hidden doctorId for doctor role */}
              {role === "doctor" && (
                <input type="hidden" name="doctorId" value={doctorId} />
              )}
              <input name="phone" value={currentPatient.phone} onChange={e => setCurrentPatient({ ...currentPatient, phone: e.target.value })} placeholder="Phone" className="w-full p-2 border rounded mb-2" />
              <input name="email" value={currentPatient.email} onChange={e => setCurrentPatient({ ...currentPatient, email: e.target.value })} placeholder="Email" className="w-full p-2 border rounded mb-2" />
              <input name="address" value={currentPatient.address} onChange={e => setCurrentPatient({ ...currentPatient, address: e.target.value })} placeholder="Address" className="w-full p-2 border rounded mb-2" />
              <input name="maritalStatus" value={currentPatient.maritalStatus} onChange={e => setCurrentPatient({ ...currentPatient, maritalStatus: e.target.value })} placeholder="Marital Status" className="w-full p-2 border rounded mb-2" />
              <input name="emergencyContactName" value={currentPatient.emergencyContactName} onChange={e => setCurrentPatient({ ...currentPatient, emergencyContactName: e.target.value })} placeholder="Emergency Contact Name" className="w-full p-2 border rounded mb-2" />
              <input name="emergencyContactPhone" value={currentPatient.emergencyContactPhone} onChange={e => setCurrentPatient({ ...currentPatient, emergencyContactPhone: e.target.value })} placeholder="Emergency Contact Phone" className="w-full p-2 border rounded mb-2" />
              {patientError && <div className="text-red-600 mb-2">{patientError}</div>}
              <div className="flex justify-end space-x-4 mt-4">
                <button type="button" onClick={() => setShowPatientModal(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add</button>
              </div>
            </form>
          </div>
        )}
        {/* Add Appointment Modal */}
        {showAppointmentModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setAppointmentError("");
                try {
                  await axios.post(`${API_BASE_URL}/appointments`, currentAppointment, {
                    headers: { Authorization: `Bearer ${token}` }
                  });
                  setShowAppointmentModal(false);
                  setCurrentAppointment(initialAppointment);
                } catch (err) {
                  setAppointmentError("Failed to add appointment");
                }
              }}
              className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
            >
              <h2 className="text-xl font-bold mb-4 text-blue-600">Add Appointment</h2>
              <input name="appointmentDateTime" type="datetime-local" value={currentAppointment.appointmentDateTime} onChange={e => setCurrentAppointment({ ...currentAppointment, appointmentDateTime: e.target.value })} className="w-full p-2 border rounded mb-2" required />
              <input name="patientId" value={currentAppointment.patientId} onChange={e => setCurrentAppointment({ ...currentAppointment, patientId: e.target.value })} placeholder="Patient ID" className="w-full p-2 border rounded mb-2" required />
              <input name="doctorId" value={currentAppointment.doctorId} onChange={e => setCurrentAppointment({ ...currentAppointment, doctorId: e.target.value })} placeholder="Doctor ID" className="w-full p-2 border rounded mb-2" required />
              <input name="status" value={currentAppointment.status} onChange={e => setCurrentAppointment({ ...currentAppointment, status: e.target.value })} placeholder="Status" className="w-full p-2 border rounded mb-2" required />
              <input name="reason" value={currentAppointment.reason} onChange={e => setCurrentAppointment({ ...currentAppointment, reason: e.target.value })} placeholder="Reason" className="w-full p-2 border rounded mb-2" />
              <input name="notes" value={currentAppointment.notes} onChange={e => setCurrentAppointment({ ...currentAppointment, notes: e.target.value })} placeholder="Notes" className="w-full p-2 border rounded mb-2" />
              {appointmentError && <div className="text-red-600 mb-2">{appointmentError}</div>}
              <div className="flex justify-end space-x-4 mt-4">
                <button type="button" onClick={() => setShowAppointmentModal(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add</button>
              </div>
            </form>
          </div>
        )}
    </div>
  );
}

export default HomePage;
