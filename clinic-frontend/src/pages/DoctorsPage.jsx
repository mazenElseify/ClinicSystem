import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";

function DoctorsPage({ user }) {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("");
  const [doctors, setDoctors] = useState([]);

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
    const matchesSearch =
      `${doctor.firstName}${doctor.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty =
      !specialtyFilter || doctor.specialty === specialtyFilter;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Doctors</h2>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name or email"
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
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : filteredDoctors.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No doctors found.
                </td>
              </tr>
            ) : (
              filteredDoctors.map((doctor) => (
                <tr key={doctor.id} className="border-t">
                  <td className="p-2">{doctor.firstName} {doctor.lastName}</td>
                  <td className="p-2">{doctor.specialty}</td>
                  <td className="p-2">{doctor.phone}</td>
                  <td className="p-2">{doctor.email}</td>
                  <td className="p-2">
                    {/* Add View/Edit/Delete buttons here if needed */}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DoctorsPage;