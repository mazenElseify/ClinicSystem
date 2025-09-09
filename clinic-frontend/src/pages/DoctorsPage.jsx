import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";

function DoctorsPage({ user }) {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [editDoctor, setEditDoctor] = useState({});
  const [error, setError] = useState("");

  const userRole = user?.role?.toLowerCase();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (userRole === "admin" || userRole === "receptionist") {
      const fetchDoctors = async () => {
        try {
          const res = await axios.get(`${API_BASE_URL}/doctors`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setDoctors(res.data);
        } catch (err) {
          setDoctors([]);
        }
        setLoading(false);
      };
      fetchDoctors();
    }
  }, [userRole, token]);

  // Only allow admin/receptionist to view this page
  if (userRole !== "admin" && userRole !== "receptionist") {
    return (
      <div className="p-6 text-red-600">
        You do not have permission to view this page.
      </div>
    );
  }

  const specialties = Array.from(new Set(doctors.map(d => d.specialty))).filter(Boolean);
  const filteredDoctors = doctors.filter((doctor) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      `${doctor.firstName} ${doctor.lastName}`.toLowerCase().includes(search) ||
      doctor.email?.toLowerCase().includes(search) ||
      (doctor.id && doctor.id.toString().includes(search));
    const matchesSpecialty =
      !specialtyFilter || doctor.specialty === specialtyFilter;
    return matchesSearch && matchesSpecialty;
  });

  // Edit doctor handler
  const handleEditDoctor = (doctor) => {
    setEditDoctor({ ...doctor });
    setShowEditModal(true);
  };

  // Save edited doctor
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/doctors/${editDoctor.id}`, editDoctor, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowEditModal(false);
      setEditDoctor({});
      setError("");
      // Refresh doctors
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/doctors`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDoctors(res.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to update doctor");
    }
  };

  // Delete doctor handler
  const handleDeleteDoctor = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/doctors/${selectedDoctor.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowDeleteModal(false);
      setSelectedDoctor(null);
      setError("");
      // Refresh doctors
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/doctors`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDoctors(res.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to delete doctor");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Doctors</h2>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name or ID or Email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full md:w-1/3"
        />
        <select
          value={specialtyFilter}
          onChange={(e) => setSpecialtyFilter(e.target.value)}
          className="border p-2 rounded w-full md:w-1/3"
        >
          <option value="">All Specialties</option>
          {specialties.map((spec) => (
            <option key={spec} value={spec}>{spec}</option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">ID</th>
              <th className="p-2">Name</th>
              <th className="p-2">Specialty</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Email</th>
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
            ) : filteredDoctors.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  No doctors found.
                </td>
              </tr>
            ) : (
              filteredDoctors.map((doctor) => (
                <tr key={doctor.id} className="border-t">
                  <td className="p-2">{doctor.id}</td>
                  <td className="p-2">{doctor.firstName} {doctor.lastName}</td>
                  <td className="p-2">{doctor.specialty}</td>
                  <td className="p-2">{doctor.phone}</td>
                  <td className="p-2">{doctor.email}</td>
                  <td className="p-2 space-x-2">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                      onClick={() => {
                        setSelectedDoctor(doctor);
                        setShowInfoModal(true);
                      }}
                    >
                      Info
                    </button>
                    <button
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                      onClick={() => handleEditDoctor(doctor)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 text-white px-2 py-1 rounded"
                      onClick={() => {
                        setSelectedDoctor(doctor);
                        setShowDeleteModal(true);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Info Modal */}
      {showInfoModal && selectedDoctor && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4 text-blue-600">
              Doctor Info
            </h2>
            <div className="mb-2"><strong>ID:</strong> {selectedDoctor.id}</div>
            <div className="mb-2"><strong>Name:</strong> {selectedDoctor.firstName} {selectedDoctor.lastName}</div>
            <div className="mb-2"><strong>Email:</strong> {selectedDoctor.email}</div>
            <div className="mb-2"><strong>Phone:</strong> {selectedDoctor.phone}</div>
            <div className="mb-2"><strong>Specialty:</strong> {selectedDoctor.specialty}</div>
            <div className="mb-2"><strong>Address:</strong> {selectedDoctor.address}</div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowInfoModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <form
            onSubmit={handleSaveEdit}
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm"
          >
            <h2 className="text-xl font-bold mb-4 text-yellow-600">
              Edit Doctor
            </h2>
            <input
              className="w-full p-2 border rounded mb-2"
              value={editDoctor.firstName || ""}
              onChange={e => setEditDoctor({ ...editDoctor, firstName: e.target.value })}
              placeholder="First Name"
              required
            />
            <input
              className="w-full p-2 border rounded mb-2"
              value={editDoctor.lastName || ""}
              onChange={e => setEditDoctor({ ...editDoctor, lastName: e.target.value })}
              placeholder="Last Name"
              required
            />
            <input
              className="w-full p-2 border rounded mb-2"
              value={editDoctor.email || ""}
              onChange={e => setEditDoctor({ ...editDoctor, email: e.target.value })}
              placeholder="Email"
              required
            />
            <input
              className="w-full p-2 border rounded mb-2"
              value={editDoctor.phone || ""}
              onChange={e => setEditDoctor({ ...editDoctor, phone: e.target.value })}
              placeholder="Phone"
            />
            <input
              className="w-full p-2 border rounded mb-2"
              value={editDoctor.specialty || ""}
              onChange={e => setEditDoctor({ ...editDoctor, specialty: e.target.value })}
              placeholder="Specialty"
            />
            <input
              className="w-full p-2 border rounded mb-2"
              value={editDoctor.address || ""}
              onChange={e => setEditDoctor({ ...editDoctor, address: e.target.value })}
              placeholder="Address"
            />
            {error && <div className="text-red-600 mb-2">{error}</div>}
            <div className="flex justify-end space-x-4 mt-4">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedDoctor && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4 text-red-600">
              Confirm Delete
            </h2>
            <p className="mb-4">
              Are you sure you want to delete Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}?
            </p>
            {error && <div className="text-red-600 mb-2">{error}</div>}
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
                onClick={handleDeleteDoctor}
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

export default DoctorsPage;