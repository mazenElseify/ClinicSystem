import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";
import { useNavigate } from "react-router-dom";

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
};

function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [currentPatient, setCurrentPatient] = useState(initialPatient);
  const [editId, setEditId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Helper to decode JWT and get role/userId
  useEffect(() => {
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserRole(payload.role);
      setUserId(payload.id);
    }
  }, [token]);

  // Fetch patients
  const fetchPatients = async () => {
    setLoading(true);
    try {
      let url = `${API_BASE_URL}/patients`;
      if (userRole === "Doctor" && userId) {
        url = `${API_BASE_URL}/patients/doctor/${userId}`;
      }
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients(res.data);
    } catch (err) {
      setError("Failed to fetch patients");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPatients();
    // eslint-disable-next-line
  }, [userRole, userId]);

  // Create patient
  const handleAddPatient = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/patients`, currentPatient, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowModal(false);
      setCurrentPatient(initialPatient);
      fetchPatients();
    } catch (err) {
      setError("Failed to add patient");
    }
  };

  // Edit patient
  const handleEditPatient = (patient) => {
    setModalType("edit");
    setEditId(patient.id);
    setCurrentPatient({
      ...initialPatient,
      ...patient,
      dateOfBirth: patient.dateOfBirth
        ? patient.dateOfBirth.slice(0, 10)
        : "",
    });
    setShowModal(true);
  };

  const handleUpdatePatient = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/patients/${editId}`, currentPatient, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowModal(false);
      setCurrentPatient(initialPatient);
      setEditId(null);
      fetchPatients();
    } catch (err) {
      setError("Failed to update patient");
    }
  };

  // Delete patient
  const handleDeletePatient = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/patients/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowDeleteModal(false);
      setDeleteId(null);
      fetchPatients();
    } catch (err) {
      setError("Failed to delete patient");
    }
  };

  // Helper to calculate age
  const getAge = (dateOfBirth) => {
    if (!dateOfBirth) return "";
    return Math.floor(
      (Date.now() - new Date(dateOfBirth).getTime()) /
        (365.25 * 24 * 60 * 60 * 1000)
    );
  };

  // Filtered patients
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.lastName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGender =
      genderFilter === "" || patient.gender === genderFilter;
    return matchesSearch && matchesGender;
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Patients</h2>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full md:w-1/3"
        />
        <select
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
          className="border p-2 rounded w-full md:w-1/3"
        >
          <option value="">All Genders</option>
          <option value="Female">Female</option>
          <option value="Male">Male</option>
          <option value="Other">Other</option>
        </select>
      </div>
      {userRole !== "Doctor" && (
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
          onClick={() => {
            setModalType("add");
            setCurrentPatient(initialPatient);
            setShowModal(true);
          }}
        >
          Add Patient
        </button>
      )}
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">First Name</th>
              <th className="p-2">Last Name</th>
              <th className="p-2">Age</th>
              <th className="p-2">Gender</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : filteredPatients.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  No patients found.
                </td>
              </tr>
            ) : (
              filteredPatients.map((patient) => (
                <tr key={patient.id} className="border-t">
                  <td className="p-2">{patient.firstName}</td>
                  <td className="p-2">{patient.lastName}</td>
                  <td className="p-2">{getAge(patient.dateOfBirth)}</td>
                  <td className="p-2">{patient.gender}</td>
                  <td className="p-2">{patient.phone}</td>
                  <td className="p-2 space-x-2">
                    <button
                      onClick={() => handleEditPatient(patient)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                      disabled={userRole === "Doctor"}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setDeleteId(patient.id);
                        setShowDeleteModal(true);
                      }}
                      className="bg-red-600 text-white px-2 py-1 rounded"
                      disabled={userRole === "Doctor"}
                    >
                      Delete
                    </button>
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                      onClick={() => navigate(`/patients/${patient.id}`)}
                      style={{ marginLeft: "4px" }}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <form
            onSubmit={modalType === "add" ? handleAddPatient : handleUpdatePatient}
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
          >
            <h2 className="text-xl font-bold mb-4 text-blue-600">
              {modalType === "add" ? "Add Patient" : "Edit Patient"}
            </h2>
            <input
              name="firstName"
              value={currentPatient.firstName}
              onChange={(e) =>
                setCurrentPatient({ ...currentPatient, firstName: e.target.value })
              }
              placeholder="First Name"
              className="w-full p-2 border rounded mb-2"
              required
            />
            <input
              name="lastName"
              value={currentPatient.lastName}
              onChange={(e) =>
                setCurrentPatient({ ...currentPatient, lastName: e.target.value })
              }
              placeholder="Last Name"
              className="w-full p-2 border rounded mb-2"
              required
            />
            <input
              type="date"
              name="dateOfBirth"
              value={currentPatient.dateOfBirth}
              onChange={(e) =>
                setCurrentPatient({ ...currentPatient, dateOfBirth: e.target.value })
              }
              className="w-full p-2 border rounded mb-2"
              required
            />
            <select
              name="gender"
              value={currentPatient.gender}
              onChange={(e) =>
                setCurrentPatient({ ...currentPatient, gender: e.target.value })
              }
              className="w-full p-2 border rounded mb-2"
              required
            >
              <option value="">Select Gender</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>
            <input
              name="phone"
              value={currentPatient.phone}
              onChange={(e) =>
                setCurrentPatient({ ...currentPatient, phone: e.target.value })
              }
              placeholder="Phone"
              className="w-full p-2 border rounded mb-2"
              required
            />
            <input
              name="email"
              value={currentPatient.email}
              onChange={(e) =>
                setCurrentPatient({ ...currentPatient, email: e.target.value })
              }
              placeholder="Email"
              className="w-full p-2 border rounded mb-2"
            />
            <input
              name="address"
              value={currentPatient.address}
              onChange={(e) =>
                setCurrentPatient({ ...currentPatient, address: e.target.value })
              }
              placeholder="Address"
              className="w-full p-2 border rounded mb-2"
            />
            <input
              name="maritalStatus"
              value={currentPatient.maritalStatus}
              onChange={(e) =>
                setCurrentPatient({ ...currentPatient, maritalStatus: e.target.value })
              }
              placeholder="Marital Status"
              className="w-full p-2 border rounded mb-2"
            />
            <input
              name="emergencyContactName"
              value={currentPatient.emergencyContactName}
              onChange={(e) =>
                setCurrentPatient({ ...currentPatient, emergencyContactName: e.target.value })
              }
              placeholder="Emergency Contact Name"
              className="w-full p-2 border rounded mb-2"
            />
            <input
              name="emergencyContactPhone"
              value={currentPatient.emergencyContactPhone}
              onChange={(e) =>
                setCurrentPatient({ ...currentPatient, emergencyContactPhone: e.target.value })
              }
              placeholder="Emergency Contact Phone"
              className="w-full p-2 border rounded mb-2"
            />
            <div className="flex justify-end space-x-4 mt-4">
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setCurrentPatient(initialPatient);
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
              Are you sure you want to delete this patient?
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
                onClick={handleDeletePatient}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientsPage;