
import { useEffect, useState } from "react";
import axios from "axios";

import API_BASE_URL from "../config";
import TruncatedCell from "../components/TruncatedCell";

function DoctorDashboardPage({ doctorId }) {
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [patientsMap, setPatientsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedReason, setSelectedReason] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editDoctor, setEditDoctor] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        if (!doctorId) {
          setError("Doctor ID not found.");
          setLoading(false);
          return;
        }
        // Fetch doctor profile by doctorId
        const doctorRes = await axios.get(`${API_BASE_URL}/doctors/${doctorId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Doctor API response:', doctorRes);
        setDoctor(doctorRes.data);

        // Fetch appointments by doctorId
        const apptRes = await axios.get(`${API_BASE_URL}/appointments/doctor/${doctorId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Appointments API response:', apptRes);
        setAppointments(apptRes.data);

        // Fetch all patients and build a map
        const patientsRes = await axios.get(`${API_BASE_URL}/patients`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Patients API response:', patientsRes);
        const map = {};
        if (Array.isArray(patientsRes.data)) {
          patientsRes.data.forEach(p => {
            map[p.id] = `${p.firstName} ${p.lastName}`;
          });
        } else {
          console.error('Expected array for patientsRes.data but got:', patientsRes.data);
        }
        setPatientsMap(map);

      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError("Failed to load data. " + (err?.response?.data?.message || err.message || ''));
        setDoctor(null);
        setAppointments([]);
        setPatientsMap({});
      }
      setLoading(false);
    };
    fetchData();
  }, [doctorId, token]);

  // Edit doctor profile
  const handleEditProfile = () => {
    setEditDoctor({ ...doctor });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    setEditDoctor({ ...editDoctor, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/doctors/${doctor.id}`, editDoctor, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctor(editDoctor);
      setShowEditModal(false);
    } catch (err) {
      alert("Failed to update profile.");
    }
  };

  // Fetch patient info for modal
  const handlePatientClick = async (patientId, reason) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/patients/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedPatient(res.data);
      setSelectedReason(reason);
      setShowPatientModal(true);
    } catch (err) {
      setSelectedPatient(null);
      setShowPatientModal(false);
      alert("Failed to load patient info.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">
        {doctor ? `Dr. ${doctor.firstName} ${doctor.lastName} Dashboard` : "Dashboard"}
      </h2>
      {error && (
        <div className="mb-4 text-red-600">{error}</div>
      )}
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : doctor ? (
        <>
          <div className="mb-6 bg-white rounded shadow p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-semibold">Profile</span>
              <button
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleEditProfile}
              >
                Edit Profile
              </button>
            </div>
            <div><strong>Name:</strong> {doctor.firstName} {doctor.lastName}</div>
            <div><strong>Specialty:</strong> {doctor.specialty}</div>
            <div><strong>Email:</strong> {doctor.email}</div>
            <div><strong>Phone:</strong> {doctor.phone}</div>
          </div>

          {/* Edit Profile Modal */}
          {showEditModal && editDoctor && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
              <form
                onSubmit={handleEditSubmit}
                className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm"
              >
                <h2 className="text-xl font-bold mb-4 text-blue-600">Edit Profile</h2>
                <input
                  name="firstName"
                  value={editDoctor.firstName}
                  onChange={handleEditChange}
                  placeholder="First Name"
                  className="w-full p-2 border rounded mb-2"
                  required
                />
                <input
                  name="lastName"
                  value={editDoctor.lastName}
                  onChange={handleEditChange}
                  placeholder="Last Name"
                  className="w-full p-2 border rounded mb-2"
                  required
                />
                <input
                  name="specialty"
                  value={editDoctor.specialty}
                  onChange={handleEditChange}
                  placeholder="Specialty"
                  className="w-full p-2 border rounded mb-2"
                />
                <input
                  name="email"
                  type="email"
                  value={editDoctor.email}
                  onChange={handleEditChange}
                  placeholder="Email"
                  className="w-full p-2 border rounded mb-2"
                  required
                />
                <input
                  name="phone"
                  value={editDoctor.phone}
                  onChange={handleEditChange}
                  placeholder="Phone"
                  className="w-full p-2 border rounded mb-2"
                />
                <div className="flex justify-end mt-4 space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          )}

          <h3 className="text-xl font-semibold mb-2 mt-8">Appointments</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="p-2">Date</th>
                  <th className="p-2">Patient</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Reason</th>
                </tr>
              </thead>
              <tbody>
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center p-4 text-gray-500">
                      No appointments found.
                    </td>
                  </tr>
                ) : (
                  appointments.map((appt) => (
                    <tr key={appt.id} className="border-t">
                      <td className="p-2">{appt.appointmentDateTime}</td>
                      <td className="p-2">
                        <button
                          className="text-blue-600 underline"
                          onClick={() => handlePatientClick(appt.patientId, appt.reason)}
                        >
                          {patientsMap[appt.patientId] || `Patient #${appt.patientId}`}
                        </button>
                      </td>
                      <td className="p-2">{appt.status}</td>
                      <td className="p-2">
                        <TruncatedCell text={appt.reason} maxLength={30} label="Reason" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="text-red-600">Doctor info not found.</div>
      )}

      {/* Patient Info Modal */}
      {showPatientModal && selectedPatient && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4 text-blue-600">
              Patient Info
            </h2>
            <div className="mb-2">
              <strong>Name:</strong> {selectedPatient.firstName} {selectedPatient.lastName}
            </div>
            <div className="mb-2">
              <strong>Email:</strong> {selectedPatient.email}
            </div>
            <div className="mb-2">
              <strong>Phone:</strong> {selectedPatient.phone}
            </div>
            <div className="mb-2">
              <strong>Reason for Appointment:</strong> {selectedReason}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowPatientModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorDashboardPage;