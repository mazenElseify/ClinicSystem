import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import API_BASE_URL from '../config';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    userName: '',
    password: '',
    email: '',
    phone: '',
    role: 'Receptionist',
  });
  const [editMode, setEditMode] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user?.role === 'Admin') {
      fetchUsers();
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users`);
      const data = await res.json();
      setUsers(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const handleInputChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (res.ok) {
        setNewUser({ userName: '', password: '', email: '', phone: '', role: 'Receptionist' });
        fetchUsers();
      } else {
        console.error('Failed to create user');
      }
    } catch (err) {
      console.error('Error creating user:', err);
    }
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete || !userToDelete.id) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/users/${userToDelete.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchUsers();
        setShowDeleteModal(false);
        setUserToDelete(null);
      } else {
        console.error('Failed to delete user: ', await res.text());
      }
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const startEditing = (user) => {
    setEditingUser({
      ...user,
      isActive: user.isActive ?? true,
    });
  };

  const cancelEditing = () => {
    setEditingUser(null);
  };

  const handleEditInputChange = (e) => {
    setEditingUser({ ...editingUser, [e.target.name]: e.target.value });
  };

  const handleUpdateUser = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: editingUser.email,
          phone: editingUser.phone,
          role: editingUser.role,
          isActive: editingUser.isActive,
        }),
      });
      if (res.ok) {
        setEditingUser(null);
        fetchUsers();
      } else {
        console.error('Failed to update user');
      }
    } catch (err) {
      console.error('Error updating user:', err);
    }
  };

  if (!user || user.role !== 'Admin') return <Navigate to="/" />;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>

      {/* Create User Form */}
      <form onSubmit={handleCreateUser} className="space-y-4 bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold">Create New User</h3>
        <input name="userName" value={newUser.userName} onChange={handleInputChange} placeholder="Username" className="w-full p-2 border rounded" required />
        <input name="password" type="password" value={newUser.password} onChange={handleInputChange} placeholder="Password" className="w-full p-2 border rounded" required />
        <input name="email" value={newUser.email} onChange={handleInputChange} placeholder="Email" className="w-full p-2 border rounded" />
        <input name="phone" value={newUser.phone} onChange={handleInputChange} placeholder="Phone" className="w-full p-2 border rounded" />
        <select name="role" value={newUser.role} onChange={handleInputChange} className="w-full p-2 border rounded">
          <option value="Admin">Admin</option>
          <option value="Receptionist">Receptionist</option>
          <option value="Doctor">Doctor</option>
        </select>
        <button type="submit" className="px-4 py-2 rounded text-white bg-pink-600">Create</button>
      </form>

      {/* Users Table */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">All Users</h3>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full bg-white rounded shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-2">Username</th>
                <th className="text-left p-2">Email</th>
                <th className="text-left p-2">Phone</th>
                <th className="text-left p-2">Role</th>
                <th className="text-left p-2">Active</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) =>
                editingUser?.userName === u.userName ? (
                  <tr key={u.userName} className="border-t bg-yellow-50">
                    <td className="p-2">{u.userName}</td>
                    <td className="p-2">
                      <input name="email" value={editingUser.email} onChange={handleEditInputChange} className="w-full border p-1" />
                    </td>
                    <td className="p-2">
                      <input name="phone" value={editingUser.phone} onChange={handleEditInputChange} className="w-full border p-1" />
                    </td>
                    <td className="p-2">
                      <select name="role" value={editingUser.role} onChange={handleEditInputChange} className="w-full border p-1">
                        <option value="Admin">Admin</option>
                        <option value="Receptionist">Receptionist</option>
                        <option value="Doctor">Doctor</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <select
                        name="isActive"
                        value={editingUser.isActive ? 'true' : 'false'}
                        onChange={(e) => setEditingUser({ ...editingUser, isActive: e.target.value === 'true' })}
                        className="w-full border p-1"
                      >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                    <td className="p-2 space-x-2">
                      <button onClick={handleUpdateUser} className="bg-blue-600 text-white px-2 py-1 rounded">Save</button>
                      <button onClick={cancelEditing} className="bg-gray-400 text-white px-2 py-1 rounded">Cancel</button>
                    </td>
                  </tr>
                ) : (
                  <tr key={u.userName} className="border-t">
                    <td className="p-2">{u.userName}</td>
                    <td className="p-2">{u.email}</td>
                    <td className="p-2">{u.phone}</td>
                    <td className="p-2">{u.role}</td>
                    <td className="p-2">{u.isActive ? 'Yes' : 'No'}</td>
                    <td className="p-2 space-x-2">
                      <button onClick={() => startEditing(u)} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
                      <button onClick={() => {
                        setUserToDelete(u);
                        setShowDeleteModal(true);
                      }} className="text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-red-600">Confirm Deletion</h2>
            <p className="mb-6">
              Are you sure you want to delete user <strong>{userToDelete?.userName}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                Cancel
              </button>
              <button onClick={confirmDeleteUser} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;
