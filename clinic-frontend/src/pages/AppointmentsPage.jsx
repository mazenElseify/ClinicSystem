import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";
import Select from "react-select";

const initialAppointment = {
  appointmentDateTime: "",
  patientId: "",
  doctorId: "",
  status: "Scheduled",
  reason: "",
  notes: "",
};

function AppointmentsPage({ user }) {
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedReason, setSelectedReason] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [currentAppointment, setCurrentAppointment] = useState(initialAppointment);
  const [editId, setEditId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("token");
  const userRole = user?.role?.toLowerCase();
  const doctorId = user?.doctorId;
  
  const patientOptions = patients.map((pat) => ({
    value: pat.id,
    label: `${pat.firstName} ${pat.lastName} (ID: ${pat.id})`,
  }));
  
  const doctorOptions = doctors.map((doc) => ({
    value: doc.id,
    label: `${doc.firstName} ${doc.lastName} (ID: ${doc.id})`,
  }));

  // Helper functions for categorizing appointments
  const isToday = (date) => {
    const d = new Date(date);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  };

  const isTomorrow = (date) => {
    const d = new Date(date);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return d.toDateString() === tomorrow.toDateString();
  };

  const isExpired = (date) => {
    const d = new Date(date);
    const now = new Date();
    return d < now && !isToday(date);
  };

  const isOngoing = (date, status) => {
    const d = new Date(date);
    const now = new Date();
    return d >= now && status.toLowerCase() === "scheduled";
  };

  // Fetch appointments, patients, doctors
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let apptRes;
        if (userRole === "doctor" && doctorId) {
          apptRes = await axios.get(`${API_BASE_URL}/appointments/doctor/${doctorId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } else {
          apptRes = await axios.get(`${API_BASE_URL}/appointments`, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }
        setAppointments(Array.isArray(apptRes.data) ? apptRes.data : apptRes.data.data || [] );

        // Patients: doctors see only their patients, others see all
        let patientRes;
        if (userRole === "doctor" && doctorId) {
          patientRes = await axios.get(`${API_BASE_URL}/patients/doctor/${doctorId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } else {
          patientRes = await axios.get(`${API_BASE_URL}/patients`, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }
        setPatients(Array.isArray(patientRes.data) ? patientRes.data : patientRes.data.data || []);

        // Doctors: all roles see all doctors (for receptionist/admin)
        const doctorRes = await axios.get(`${API_BASE_URL}/doctors`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDoctors(Array.isArray(doctorRes.data) ? doctorRes.data : doctorRes.data.data || [] );
      } catch (err) {}
      setLoading(false);
    };
    fetchData();
  }, [userRole, doctorId, token]);

  // Add appointment
  
  const handleAddAppointment = async (e) => {
    e.preventDefault();
    try {
      let payload = {...currentAppointment};
      if (userRole === "doctor") {
        payload.doctorId = doctorId;
      }
      await axios.post(`${API_BASE_URL}/appointments`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowModal(false);
      setCurrentAppointment(initialAppointment);
      fetchAppointments();
    } catch (err) {}
  };

  // Edit appointment
  const handleEditAppointment = (appt) => {
    setModalType("edit");
    setEditId(appt.id);
    setCurrentAppointment({
      ...initialAppointment,
      ...appt,
      appointmentDateTime: appt.appointmentDateTime?.slice(0, 16),
    });
    setShowModal(true);
  };

  const handleUpdateAppointment = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/appointments/${editId}`, currentAppointment, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowModal(false);
      setCurrentAppointment(initialAppointment);
      setEditId(null);
      fetchAppointments();
    } catch (err) {}
  };

  // Delete appointment
  const handleDeleteAppointment = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/appointments/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowDeleteModal(false);
      setDeleteId(null);
      fetchAppointments();
    } catch (err) {}
  };

  // Refetch appointments after add/edit/delete
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      let apptRes;
      if (userRole === "doctor") {
        apptRes = await axios.get(`${API_BASE_URL}/appointments/doctor/${doctorId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        apptRes = await axios.get(`${API_BASE_URL}/appointments`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setAppointments(Array.isArray(apptRes.data) ? apptRes.data : apptRes.data.data || []);
    } catch (err) {}
    setLoading(false);
  };

  // Search/filter appointments by patient/doctor name
  const filteredAppointments = appointments.filter((appt) => {
    const patient = patients.find(p => p.id === appt.patientId);
    const doctor = doctors.find(d => d.id === appt.doctorId);
    const patientName = patient ? `${patient.firstName} ${patient.lastName}` : "";
    const doctorName = doctor ? `${doctor.firstName} ${doctor.lastName}` : "";
    return (
      patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctorName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Categorize appointments
  const expiredAppointments = filteredAppointments.filter(
    (appt) => isExpired(appt.appointmentDateTime)
  );
  const todayAppointments = filteredAppointments.filter(
    (appt) => isToday(appt.appointmentDateTime)
  );
  const tomorrowAppointments = filteredAppointments.filter(
    (appt) => isTomorrow(appt.appointmentDateTime)
  );
  const ongoingAppointments = filteredAppointments.filter(
    (appt) => isOngoing(appt.appointmentDateTime, appt.status)
  );
  const otherAppointments = filteredAppointments.filter(
    (appt) =>
      !isExpired(appt.appointmentDateTime) &&
      !isToday(appt.appointmentDateTime) &&
      !isTomorrow(appt.appointmentDateTime) &&
      !isOngoing(appt.appointmentDateTime, appt.status)
  );

  // Table render helper
  function renderTable(appointments) {
    return (
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">Date</th>
              <th className="p-2">Patient</th>
              <th className="p-2">Doctor</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No appointments found.
                </td>
              </tr>
            ) : (
              appointments.map((appt) => {
                const patient = patients.find(p => p.id === appt.patientId);
                const doctor = doctors.find(d => d.id === appt.doctorId);
                return (
                  <tr key={appt.id} className="border-t">
                    <td className="p-2">{appt.appointmentDateTime}</td>
                    <td className="p-2">
                      {patient ? (
                        <button
                          className="text-blue-600 underline"
                          onClick={() => {
                            setSelectedPatient(patient);
                            setSelectedReason(appt.reason);
                            setShowPatientModal(true);
                          }}
                        >
                          {patient.firstName} {patient.lastName}
                        </button>
                      ) : ""}
                    </td>
                    <td className="p-2">{doctor ? `${doctor.firstName} ${doctor.lastName}` : ""}</td>
                    <td className="p-2">{appt.status}</td>
                    <td className="p-2 space-x-2">
                      <button
                        onClick={() => handleEditAppointment(appt)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setDeleteId(appt.id);
                          setShowDeleteModal(true);
                        }}
                        className="bg-red-600 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Appointments</h2>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by patient or doctor"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full md:w-1/3"
        />
        {(userRole === "admin" || userRole === "receptionist") && (
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => {
              setModalType("add");
              setCurrentAppointment(initialAppointment);
              setShowModal(true);
            }}
          >
            Add Appointment
          </button>
        )}
        {userRole === "doctor" && (
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => {
              setModalType("add");
              setCurrentAppointment({
                ...initialAppointment,
                doctorId: doctorId
              });
              setShowModal(true);
            }}
          >
            Add Appointment
          </button>
        )}
      </div>

      <h3 className="text-xl font-bold mt-6 mb-2 text-blue-600">Today's Appointments</h3>
      {renderTable(todayAppointments)}

      <h3 className="text-xl font-bold mt-6 mb-2 text-green-600">Tomorrow's Appointments</h3>
      {renderTable(tomorrowAppointments)}

      {/* <h3 className="text-xl font-bold mt-6 mb-2 text-yellow-600">Ongoing Appointments</h3>
      {renderTable(ongoingAppointments)} */}

      <h3 className="text-xl font-bold mt-6 mb-2 text-gray-600">Other Appointments</h3>
      {renderTable(otherAppointments)}

      <h3 className="text-xl font-bold mt-6 mb-2 text-red-600">Expired Appointments</h3>
      {renderTable(expiredAppointments)}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <form
            onSubmit={modalType === "add" ? handleAddAppointment : handleUpdateAppointment}
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
          >
            <h2 className="text-xl font-bold mb-4 text-blue-600">
              {modalType === "add" ? "Add Appointment" : "Edit Appointment"}
            </h2>
            {/* Doctor dropdown (admin/receptionist only) */}
            {(userRole === "admin" || userRole === "receptionist") && (
             <Select
              options= {doctorOptions}
              value={doctorOptions.find(opt => opt.value === currentAppointment.doctorId) || null}
              onChange={option => 
                setCurrentAppointment({ ...currentAppointment, doctorId: option ? option.value : "" })
              }
              placeholder= "Search doctor by name or ID"
              isClearable
              className= "mb-2"
            />      
            )}
            {/* Doctor field for doctor role (hidden) */}
            {userRole === "doctor" && (
              <input type="hidden" value={doctorId} name="doctorId" />
            )}
            {/* Patient dropdown */}
            <Select
              options={patientOptions}
              value={patientOptions.find(opt => opt.value === currentAppointment.patientId) || null}
              onChange={option =>
                setCurrentAppointment({ ...currentAppointment, patientId: option ? option.value : "" })
              }
              placeholder="Search patient by name or ID"
              isClearable
              className="mb-2"
            />
            <input
              name="appointmentDateTime"
              type="datetime-local"
              value={currentAppointment.appointmentDateTime}
              onChange={(e) =>
                setCurrentAppointment({ ...currentAppointment, appointmentDateTime: e.target.value })
              }
              className="w-full p-2 border rounded mb-2"
              required
            />
            <input
              name="status"
              value={currentAppointment.status}
              onChange={(e) =>
                setCurrentAppointment({ ...currentAppointment, status: e.target.value })
              }
              placeholder="Status"
              className="w-full p-2 border rounded mb-2"
              required
            />
            <input
              name="reason"
              value={currentAppointment.reason}
              onChange={(e) =>
                setCurrentAppointment({ ...currentAppointment, reason: e.target.value })
              }
              placeholder="Reason"
              className="w-full p-2 border rounded mb-2"
            />
            {modalType === "edit" && (
              <input
                name="notes"
                value={currentAppointment.notes || ""}
                onChange={(e) =>
                  setCurrentAppointment({ ...currentAppointment, notes: e.target.value })
                }
                placeholder="Notes"
                className="w-full p-2 border rounded mb-2"
              />
            )}
            <div className="flex justify-end space-x-4 mt-4">
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setCurrentAppointment(initialAppointment);
                  setEditId(null);
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {modalType === "add" ? "Add" : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-red-600">
              Confirm Delete
            </h2>
            <p className="mb-4">
              Are you sure you want to delete this appointment?
            </p>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAppointment}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
        
      )}
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

export default AppointmentsPage;