import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";

function PatientDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [patient, setPatient] = useState(null);
  const [sections, setSections] = useState({});
  const [expanded, setExpanded] = useState("");
  const [loadingSection, setLoadingSection] = useState("");
  const [showAddModal, setShowAddModal] = useState({ section: "", open: false });
  const [editItem, setEditItem] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/patients/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPatient(res.data))
      .catch(() => setError("Failed to fetch patient info"));
  }, [id, token]);

  // Fetch section data only when expanded
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

  // Add/Edit handlers (template, expand for each section)
  const handleAdd = (section) => setShowAddModal({ section, open: true });
  const handleEdit = (section, item) => {
    setEditItem(item);
    setShowAddModal({ section, open: true });
  };

  // Example submit handler (expand for each section)
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Implement add/edit logic for each section here
    setShowAddModal({ section: "", open: false });
    setEditItem(null);
    fetchSection(showAddModal.section);
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
    <div className="p-6">
      <button
        className="mb-4 px-4 py-2 bg-gray-300 rounded"
        onClick={() => navigate(-1)}
      >
        Back
      </button>
      <h2 className="text-2xl font-bold mb-4">Patient Details</h2>
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>
      )}
      {patient && (
        <div className="mb-4 p-4 bg-gray-100 rounded">
          <div>
            <strong>Name:</strong> {patient.firstName} {patient.lastName}
          </div>
          <div>
            <strong>Gender:</strong> {patient.gender}
          </div>
          <div>
            <strong>Phone:</strong> {patient.phone}
          </div>
          {/* ...other info... */}
        </div>
      )}

      {sectionList.map((section) => (
        <div key={section.key} className="mb-6">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => {
              setExpanded(expanded === section.key ? "" : section.key);
              if (expanded !== section.key) fetchSection(section.key);
            }}
          >
            {expanded === section.key ? "Hide" : "Show"} {section.label}
          </button>
          {expanded === section.key && (
            <div className="mt-2 bg-white border rounded p-4">
              <div className="flex justify-between mb-2">
                <span className="font-semibold">{section.label}</span>
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded"
                  onClick={() => handleAdd(section.key)}
                >
                  Add
                </button>
              </div>
              {loadingSection === section.key ? (
                <div>Loading...</div>
              ) : sections[section.key] && sections[section.key].length ? (
                <table className="min-w-full border">
                  <thead>
                    <tr>
                      {Object.keys(sections[section.key][0])
                        .filter((k) => k !== "id")
                        .map((k) => (
                          <th key={k} className="p-2 border">
                            {k}
                          </th>
                        ))}
                      <th className="p-2 border">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sections[section.key].map((item) => (
                      <tr key={item.id}>
                        {Object.entries(item)
                          .filter(([k]) => k !== "id")
                          .map(([k, v]) => (
                            <td key={k} className="p-2 border">
                              {String(v)}
                            </td>
                          ))}
                        <td className="p-2 border">
                          <button
                            className="bg-yellow-500 text-white px-2 py-1 rounded"
                            onClick={() => handleEdit(section.key, item)}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-gray-500">No records found.</div>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Add/Edit Modal (template, expand for each section) */}
      {showAddModal.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
          >
            <h2 className="text-xl font-bold mb-4 text-blue-600">
              {editItem ? "Edit" : "Add"} {showAddModal.section}
            </h2>
            {/* ...form fields for the section... */}
            <div className="flex justify-end space-x-4 mt-4">
              <button
                type="button"
                onClick={() => {
                  setShowAddModal({ section: "", open: false });
                  setEditItem(null);
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {editItem ? "Save" : "Add"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default PatientDetailsPage;