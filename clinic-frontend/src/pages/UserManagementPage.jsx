import React, { useEffect, useState } from "react";
import axios from "axios";
import ConfirmationModal from "./ConfirmationModal";
import API_BASE_URL from "../config";

const GENDERS = ["Male", "Female", "Other"];
const MARITAL_STATUSES = ["Single", "Married", "Divorced", "Widowed"];
const DOCTOR_SPECIALTIES = [
  "Obstetric",
  "Gynecology",
  "Gynecology & Obstetric",
  "Cardiology",
  "Dermatology",
  "Neurology",
  "Pediatrics",
  "General Surgery",
  "Internal Medicine",
  "Orthopedics",
  "Radiology",
  "Psychiatry",
  // Add more as needed
];

const UserManagementPage = () => {
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [doctorDetails, setDoctorDetails] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    specialty: "",
    phone: "",
    email: "",
    licenseNumber: "",
    maritalStatus: "",
  });
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    userName: "",
    password: "",
    email: "",
    phone: "",
    role: "Receptionist"
  });
  const [editingUser, setEditingUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${API_BASE_URL}/users`,{
        headers:{
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Create user
  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (newUser.role === "Doctor") {
      // Open doctor modal, prefill, but do NOT create user yet
      setDoctorDetails((prev) => ({
        ...prev,
        email: newUser.email,
        phone: newUser.phone,
      }));
      setShowDoctorModal(true);
    } else {
      // Create user as usual
      try {
        await axios.post(`${API_BASE_URL}/users`, newUser, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchUsers();
        setNewUser({
          userName: "",
          password: "",
          email: "",
          phone: "",
          role: "Receptionist"
        });
      } catch (error) {
        console.error("Failed to create user", error);
      }
    }
  };

  const handleDoctorInputChange = (e) => {
    setDoctorDetails({ ...doctorDetails, [e.target.name]: e.target.value });
  };

  const handleDoctorSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      // 1. Create user
      const userRes = await axios.post(`${API_BASE_URL}/users`, newUser
      );
      const createdUser = userRes.data;
      // 2. Create doctor
      await axios.post(`${API_BASE_URL}/doctors`, {
        ...doctorDetails,
        userId: createdUser.id,
      }, {
        headers: {authorization: `Bearer ${token}`}
      });
      setShowDoctorModal(false);
      setDoctorDetails({
        firstName: "",
        lastName: "",
        gender: "",
        specialty: "",
        phone: "",
        email: "",
        licenseNumber: "",
        maritalStatus: "",
      });
      setNewUser({
        userName: "",
        password: "",
        email: "",
        phone: "",
        role: "Receptionist"
      });
      fetchUsers();
    } catch (error) {
      console.error("Failed to create doctor and user", error);
    }
  };

  // When cancelling doctor modal, just close it and reset doctor details (do NOT create user)
  const handleCancelDoctor = () => {
    setShowDoctorModal(false);
    setDoctorDetails({
      firstName: "",
      lastName: "",
      gender: "",
      specialty: "",
      phone: "",
      email: "",
      licenseNumber: "",
      maritalStatus: "",
    });
  };

  // Edit user
  const startEditing = (user) => setEditingUser({ ...user });
  const cancelEditing = () => setEditingUser(null);

  const handleUpdateUser = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(`${API_BASE_URL}/users/${editingUser.id}`, editingUser, {
        headers: {Authorization: `Bearer ${token}`}
      });
      fetchUsers();
      setEditingUser(null);
    } catch (error) {
      console.error("Failed to update user", error);
    }
  };

  // Delete user
  const handleDeleteUser = async () => {
    const token = localStorage.getItem("token");
    try {
      
      await axios.delete(`${API_BASE_URL}/users/${userToDelete.id}`, {
        headers: {Authorization: `Bearer ${token}` }
      });
      fetchUsers();
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  };

  // Filtered users
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.userName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Users Management</h2>

      {/* Create New User */}
      <div className="bg-gray-100 p-4 rounded shadow mb-6">
        <h3 className="text-xl font-semibold mb-2">Create New User</h3>
        <form
          className="grid grid-cols-1 md:grid-cols-3 gap-2"
          onSubmit={handleCreateUser}
        >
          <input
            type="text"
            placeholder="Username"
            value={newUser.userName}
            onChange={(e) => setNewUser({ ...newUser, userName: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Phone"
            value={newUser.phone}
            onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
            className="border p-2 rounded"
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            className="border p-2 rounded"
          >
            <option value="Admin">Admin</option>
            <option value="Receptionist">Receptionist</option>
            <option value="Doctor">Doctor</option>
          </select>
          <button
            type="submit"
            className="bg-green-600 text-white rounded p-2"
          >
            Create
          </button>
        </form>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by username"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full md:w-1/3"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border p-2 rounded w-full md:w-1/3"
        >
          <option value="">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="Receptionist">Receptionist</option>
          <option value="Doctor">Doctor</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">Username</th>
              <th className="p-2">Email</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Role</th>
              <th className="p-2">Active</th>
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
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) =>
                editingUser?.id === user.id ? (
                  <tr key={user.id} className="border-t bg-yellow-50">
                    <td className="p-2">{user.userName}</td>
                    <td className="p-2">
                      <input
                        name="email"
                        value={editingUser.email}
                        onChange={(e) =>
                          setEditingUser({ ...editingUser, email: e.target.value })
                        }
                        className="w-full border p-1"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        name="phone"
                        value={editingUser.phone}
                        onChange={(e) =>
                          setEditingUser({ ...editingUser, phone: e.target.value })
                        }
                        className="w-full border p-1"
                      />
                    </td>
                    <td className="p-2">
                      <select
                        name="role"
                        value={editingUser.role}
                        onChange={(e) =>
                          setEditingUser({ ...editingUser, role: e.target.value })
                        }
                        className="w-full border p-1"
                      >
                        <option value="Admin">Admin</option>
                        <option value="Receptionist">Receptionist</option>
                        <option value="Doctor">Doctor</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <select
                        name="isActive"
                        value={editingUser.isActive ? "true" : "false"}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            isActive: e.target.value === "true"
                          })
                        }
                        className="w-full border p-1"
                      >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                    <td className="p-2 space-x-2">
                      <button
                        onClick={handleUpdateUser}
                        className="bg-blue-600 text-white px-2 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="bg-gray-400 text-white px-2 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr key={user.id} className="border-t">
                    <td className="p-2">{user.userName}</td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">{user.phone}</td>
                    <td className="p-2">{user.role}</td>
                    <td className="p-2">{user.isActive ? "Yes" : "No"}</td>
                    <td className="p-2 space-x-2">
                      <button
                        onClick={() => startEditing(user)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setUserToDelete(user);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
      </div>

      <ConfirmationModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteUser}
        message={`Are you sure you want to delete user "${userToDelete?.userName}"?`}
      />

      {/* Doctor Details Modal */}
      {showDoctorModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <form
            onSubmit={handleDoctorSubmit}
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
          >
            <h2 className="text-xl font-bold mb-4 text-pink-600">Doctor Details</h2>
            <input
              name="firstName"
              value={doctorDetails.firstName}
              onChange={handleDoctorInputChange}
              placeholder="First Name"
              className="w-full p-2 border rounded mb-2"
              required
            />
            <input
              name="lastName"
              value={doctorDetails.lastName}
              onChange={handleDoctorInputChange}
              placeholder="Last Name"
              className="w-full p-2 border rounded mb-2"
              required
            />
            <select
              name="gender"
              value={doctorDetails.gender}
              onChange={handleDoctorInputChange}
              className="w-full p-2 border rounded mb-2"
              required
            >
              <option value="">Select Gender</option>
              {GENDERS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            <select
              name="specialty"
              value={doctorDetails.specialty}
              onChange={handleDoctorInputChange}
              className="w-full p-2 border rounded mb-2"
              required
            >
              <option value="">Select Specialty</option>
              {DOCTOR_SPECIALTIES.map((spec) => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
            <input
              name="phone"
              value={doctorDetails.phone}
              placeholder="Phone"
              className="w-full p-2 border rounded mb-2 bg-gray-100"
              disabled
            />
            <input
              name="email"
              value={doctorDetails.email}
              placeholder="Email"
              className="w-full p-2 border rounded mb-2 bg-gray-100"
              disabled
            />
            <input
              name="licenseNumber"
              value={doctorDetails.licenseNumber}
              onChange={handleDoctorInputChange}
              placeholder="License Number"
              className="w-full p-2 border rounded mb-2"
            />
            <select
              name="maritalStatus"
              value={doctorDetails.maritalStatus}
              onChange={handleDoctorInputChange}
              className="w-full p-2 border rounded mb-2"
              required
            >
              <option value="">Select Marital Status</option>
              {MARITAL_STATUSES.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                type="button"
                onClick={handleCancelDoctor}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
              >
                Save Doctor
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;