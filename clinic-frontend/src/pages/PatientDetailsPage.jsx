import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";

function PatientDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [currentUser, setCurrentUser] = useState(null);
  const [patient, setPatient] = useState(null);
  const [sections, setSections] = useState({});
  const [expanded, setExpanded] = useState("");
  const [loadingSection, setLoadingSection] = useState("");
  const [showAddModal, setShowAddModal] = useState({ section: "", open: false });
  const [editItem, setEditItem] = useState(null);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({});

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCurrentUser(res.data))
      .catch(() => setError("Failed to fetch user info"));
  }, [token]);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/patients/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPatient(res.data))
      .catch(() => setError("Failed to fetch patient info"));
  }, [id, token]);

  const fetchSection = async (section) => {
    setLoadingSection(section);
    let url = "";
    switch (section) {
      case "appointments":
        url = `${API_BASE_URL}/appointments/patient/${id}`;
        break;
      case "labTests":
        url = `${API_BASE_URL}/labtests/patient/${id}`;
        break;
      case "gynecologicalHistory":
        url = `${API_BASE_URL}/gynecologicalhistories/patient/${id}`;
        break;
      case "obstetricHistory":
        url = `${API_BASE_URL}/obstetrichistories/patient/${id}`;
        break;
      case "prescriptions":
        url = `${API_BASE_URL}/prescriptions/patient/${id}`;
        break;
      case "antenatalVisits":
        url = `${API_BASE_URL}/antenatalvisits/patient/${id}`;
        break;
      default:
        setLoadingSection("");
        return;
    }
    try {
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSections((prev) => ({ ...prev, [section]: res.data }));
    } catch {
      setError(`Failed to fetch ${section}`);
    }
    setLoadingSection("");
  };

  const canAddOrEditSection = (section) => {
    if (!currentUser || !patient) return false;
    if (currentUser.role === "Admin") return true;
    if (currentUser.role === "Doctor") {
      if (patient.doctorId !== currentUser.doctorId) return false;
      return true;
    }
    if (currentUser.role === "Receptionist") {
      return section === "appointments";
    }
    return false;
  };

  const canEditItem = (section) => {
    if (!currentUser || !patient) return false;
    if (currentUser.role === "Admin") return true;
    if (currentUser.role === "Doctor") {
      return patient.doctorId === currentUser.doctorId;
    }
    if (currentUser.role === "Receptionist") {
      return section === "appointments";
    }
    return false;
  };

  const handleAdd = (section) => {
    setEditItem(null);
    setFormData({});
    setShowAddModal({ section, open: true });
  };

  const handleEdit = (section, item) => {
    setEditItem(item);
    setFormData(item);
    setShowAddModal({ section, open: true });
  };

  // Dynamic form fields for each section
  const renderFormFields = () => {
    switch (showAddModal.section) {
      case "appointments":
        return (
          <>
            <input
              type="datetime-local"
              name="date"
              required
              className="w-full p-2 border rounded mb-2"
              placeholder="Date"
              value={formData.date || ""}
              onChange={e => setFormData({ ...formData, date: e.target.value })}
            />
            <input
              type="text"
              name="reason"
              required
              className="w-full p-2 border rounded mb-2"
              placeholder="Reason"
              value={formData.reason || ""}
              onChange={e => setFormData({ ...formData, reason: e.target.value })}
            />
          </>
        );
      case "labTests":
        return (
          <>
            <input
              type="text"
              name="testName"
              required
              className="w-full p-2 border rounded mb-2"
              placeholder="Test Name"
              value={formData.testName || ""}
              onChange={e => setFormData({ ...formData, testName: e.target.value })}
            />
            <input
              type="date"
              name="testDate"
              required
              className="w-full p-2 border rounded mb-2"
              placeholder="Test Date"
              value={formData.testDate || ""}
              onChange={e => setFormData({ ...formData, testDate: e.target.value })}
            />
          </>
        );
      case "gynecologicalHistory":
        return (
          <>
            <input
              type="text"
              name="condition"
              required
              className="w-full p-2 border rounded mb-2"
              placeholder="Condition"
              value={formData.condition || ""}
              onChange={e => setFormData({ ...formData, condition: e.target.value })}
            />
            <input
              type="text"
              name="notes"
              className="w-full p-2 border rounded mb-2"
              placeholder="Notes"
              value={formData.notes || ""}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
            />
          </>
        );
      case "obstetricHistory":
        return (
          <>
            <input
              type="text"
              name="event"
              required
              className="w-full p-2 border rounded mb-2"
              placeholder="Event"
              value={formData.event || ""}
              onChange={e => setFormData({ ...formData, event: e.target.value })}
            />
            <input
              type="text"
              name="notes"
              className="w-full p-2 border rounded mb-2"
              placeholder="Notes"
              value={formData.notes || ""}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
            />
          </>
        );
      case "prescriptions":
        return (
          <>
            <input
              type="text"
              name="medication"
              required
              className="w-full p-2 border rounded mb-2"
              placeholder="Medication"
              value={formData.medication || ""}
              onChange={e => setFormData({ ...formData, medication: e.target.value })}
            />
            <input
              type="text"
              name="dosage"
              required
              className="w-full p-2 border rounded mb-2"
              placeholder="Dosage"
              value={formData.dosage || ""}
              onChange={e => setFormData({ ...formData, dosage: e.target.value })}
            />
          </>
        );
      case "antenatalVisits":
        return (
          <>
            <input
              type="date"
              name="visitDate"
              required
              className="w-full p-2 border rounded mb-2"
              placeholder="Visit Date"
              value={formData.visitDate || ""}
              onChange={e => setFormData({ ...formData, visitDate: e.target.value })}
            />
            <input
              type="text"
              name="notes"
              className="w-full p-2 border rounded mb-2"
              placeholder="Notes"
              value={formData.notes || ""}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
            />
          </>
        );
      default:
        return null;
    }
  };

  // Handle submit for add/edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    let url = "";
    let method = editItem ? "put" : "post";
    let data = { ...formData, patientId: id };
    switch (showAddModal.section) {
      case "appointments":
        url = `${API_BASE_URL}/appointments${editItem ? "/" + editItem.id : ""}`;
        break;
      case "labTests":
        url = `${API_BASE_URL}/labtests${editItem ? "/" + editItem.id : ""}`;
        break;
      case "gynecologicalHistory":
        url = `${API_BASE_URL}/gynecologicalhistories${editItem ? "/" + editItem.id : ""}`;
        break;
      case "obstetricHistory":
        url = `${API_BASE_URL}/obstetrichistories${editItem ? "/" + editItem.id : ""}`;
        break;
      case "prescriptions":
        url = `${API_BASE_URL}/prescriptions${editItem ? "/" + editItem.id : ""}`;
        break;
      case "antenatalVisits":
        url = `${API_BASE_URL}/antenatalvisits${editItem ? "/" + editItem.id : ""}`;
        break;
      default:
        return;
    }
    try {
      await axios[method](url, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowAddModal({ section: "", open: false });
      setEditItem(null);
      setFormData({});
      fetchSection(showAddModal.section);
    } catch {
      setError("Failed to save data.");
    }
  };

  const sectionList = [
    { label: "Appointments", key: "appointments" },
    { label: "Lab Tests", key: "labTests" },
    { label: "Gynecological History", key: "gynecologicalHistory" },
    { label: "Obstetric History", key: "obstetricHistory" },
    { label: "Prescriptions", key: "prescriptions" },
    { label: "Antenatal Visits", key: "antenatalVisits" },
  ];

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-6xl mt-8">
        <button
          className="mb-4 px-4 py-2 bg-gray-300 rounded"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>
        )}
        {patient && (
          <div className="mb-6 p-6 bg-white rounded shadow text-center">
            <h2 className="text-3xl font-bold mb-2">
              {patient.firstName} {patient.lastName}            
            </h2>
            <div className="text-ggray-700 mb-1">
              <strong>Patient ID</strong> {patient.id}
            </div>
            <div className="text-gray-700 mb-1">
              <strong>Gender:</strong> {patient.gender}
            </div>
            <div className="text-gray-700 mb-1">
              <strong>Phone:</strong> {patient.phone}
            </div>
            <div className="text-gray-700 mb-1">
              <strong>Email:</strong> {patient.email}
            </div>
            <div className="text-gray-700 mb-1">
              <strong>Date of Birth:</strong>{" "}
              {patient.dateOfBirth ? patient.dateOfBirth.split("T")[0] : ""}
            </div>
            <div className="text-gray-700 mb-1">
              <strong>Age:</strong>{" "}
              {patient.dateOfBirth
                ? Math.floor(
                    (new Date() - new Date(patient.dateOfBirth)) /
                      (365.25 * 24 * 60 * 60 * 1000)
                  )
                : ""}
            </div>
            <div className="text-gray-700 mb-1">
              <strong>Address:</strong> {patient.address}
            </div>
            <div className="text-gray-700 mb-1">
              <strong>National ID:</strong> {patient.nationalId}
            </div>
            <div className="text-gray-700 mb-1">
              <strong>Marital Status:</strong> {patient.maritalStatus}
            </div>
            <div className="text-gray-700 mb-1">
              <strong>Occupation:</strong> {patient.occupation}
            </div>
            <div className="text-gray-700 mb-1">
              <strong>Blood Type:</strong> {patient.bloodType}
            </div>
            <div className="text-gray-700 mb-1">
              <strong>Doctor:</strong> {patient.doctorName || ""}
            </div>
            {/* Add any other patient fields you have */}
          </div>
        )}

        {sectionList.map((section) => (
          <div key={section.key} className="mb-10 flex justify-center">
            <div className="w-full max-w-6xl">
              {/* Section Header - centered name */}
              <div className="flex flex-col items-center bg-gray-100 rounded-t px-6 pt-6 pb-2 shadow">
                <span className="font-bold text-xl text-gray-800 text-center">{section.label}</span>
                <hr className="w-16 my-2 border-gray-300" />
                <button
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 transition-all duration-300"
                  style={{ color: "#333", border: "none" }}
                  onClick={() => {
                    setExpanded(expanded === section.key ? "" : section.key);
                    if (expanded !== section.key) fetchSection(section.key);
                  }}
                  aria-label={expanded === section.key ? "Collapse" : "Expand"}
                >
                  <span
                    style={{
                      fontSize: "2rem",
                      transition: "transform 0.3s",
                      transform: expanded === section.key ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  >
                    ▼
                  </span>
                </button>
                {canAddOrEditSection(section.key) && (
                  <button
                    className="mt-4 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
                    onClick={() => handleAdd(section.key)}
                  >
                    Add
                  </button>
                )}
              </div>
              {/* Section Table with animation */}
              <div
                style={{
                  maxHeight: expanded === section.key ? "1000px" : "0px",
                  overflow: "hidden",
                  transition: "max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                {expanded === section.key && (
                  <div className="w-full bg-white border rounded-b p-6 shadow-lg animate-fade-in">
                    {loadingSection === section.key ? (
                      <div>Loading...</div>
                    ) : sections[section.key] && sections[section.key].length ? (
                      <table className="min-w-full border mx-auto">
                        <thead>
                          <tr>
                            {Object.keys(sections[section.key][0])
                              .filter((k) => k !== "id")
                              .map((k) => (
                                <th key={k} className="p-2 border font-normal text-gray-700">
                                  {k}
                                </th>
                              ))}
                            <th className="p-2 border font-normal text-gray-700">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sections[section.key].map((item) => (
                            <tr key={item.id}>
                              {Object.entries(item)
                                .filter(([k]) => k !== "id")
                                .map(([k, v]) => (
                                  <td key={k} className="p-2 border text-gray-800">
                                    {String(v)}
                                  </td>
                                ))}
                              <td className="p-2 border">
                                {canEditItem(section.key) && (
                                  <button
                                    className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500"
                                    onClick={() => handleEdit(section.key, item)}
                                  >
                                    Edit
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="text-gray-500 text-center">No records found.</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Add/Edit Modal */}
        {showAddModal.open && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
            >
              <h2 className="text-xl font-bold mb-4 text-gray-700">
                {editItem ? "Edit" : "Add"} {showAddModal.section}
              </h2>
              {renderFormFields()}
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal({ section: "", open: false });
                    setEditItem(null);
                    setFormData({});
                  }}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
                >
                  {editItem ? "Save" : "Add"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientDetailsPage;