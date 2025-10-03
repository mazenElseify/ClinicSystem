import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";
import TruncatedCell from "../components/TruncatedCell";

const sectionConfigs = [
	{
		key: "appointments",
		label: "Appointments",
		fields: [
			{ name: "appointmentDateTime", label: "Date & Time", type: "datetime-local" },
			{ name: "status", label: "Status", type: "text" },
			{ name: "reason", label: "Reason", type: "text" },
			{ name: "notes", label: "Notes", type: "textarea" },
		],
		api: "appointments",
	},
	{
		key: "labTests",
		label: "Lab Tests",
		fields: [
			{ name: "testName", label: "Test Name", type: "text" },
			{ name: "result", label: "Result", type: "text" },
			{ name: "resultDate", label: "Result Date", type: "date" },
			{ name: "notes", label: "Notes", type: "textarea" },
		],
		api: "labtests",
	},
	{
		key: "gynecologicalHistory",
		label: "Gynecological History",
		fields: [
			{ name: "manarcheAge", label: "Manarche Age", type: "number" },
			{ name: "cycleLength", label: "Cycle Length", type: "number" },
			{ name: "cycleRegular", label: "Cycle Regular", type: "checkbox" },
			{ name: "lastMenstralPeriod", label: "Last Menstrual Period", type: "date" },
			{ name: "contraceptiveUse", label: "Contraceptive Use", type: "text" },
			{ name: "papSmearDate", label: "Pap Smear Date", type: "date" },
			{ name: "hpvStatus", label: "HPV Status", type: "text" },
			{ name: "sexuallyActive", label: "Sexually Active", type: "checkbox" },
			{ name: "notes", label: "Notes", type: "textarea" },
		],
		api: "gynecologicalhistories",
	},
	{
		key: "obstetricHistory",
		label: "Obstetric History",
		fields: [
			{ name: "gravida", label: "Gravida", type: "number" },
			{ name: "para", label: "Para", type: "number" },
			{ name: "abortions", label: "Abortions", type: "number" },
			{ name: "livingChildren", label: "Living Children", type: "number" },
			{ name: "ectopicPregnancies", label: "Ectopic Pregnancies", type: "number" },
			{ name: "stillbirths", label: "Stillbirths", type: "number" },
			{ name: "lastDeliveryDate", label: "Last Delivery Date", type: "date" },
			{ name: "deliveryType", label: "Delivery Type", type: "text" },
			{ name: "complications", label: "Complications", type: "textarea" },
		],
		api: "obstetrichistories",
	},
	{
		key: "prescriptions",
		label: "Prescriptions",
		fields: [
			{ name: "medicationName", label: "Medication Name", type: "text" },
			{ name: "dosage", label: "Dosage", type: "text" },
			{ name: "frequency", label: "Frequency", type: "text" },
			{ name: "duration", label: "Duration", type: "text" },
			{ name: "instructions", label: "Instructions", type: "textarea" },
		],
		api: "prescriptions",
	},
	{
		key: "antenatalVisits",
		label: "Antenatal Visits",
		fields: [
			{ name: "visitDate", label: "Visit Date", type: "date" },
			{ name: "bloodPresure", label: "Blood Pressure", type: "text" },
			{ name: "weight", label: "Weight", type: "number" },
			{ name: "fetalHeartRate", label: "Fetal Heart Rate", type: "number" },
			{ name: "urineTestResult", label: "Urine Test Result", type: "text" },
			{ name: "doctorNotes", label: "Doctor Notes", type: "textarea" },
		],
		api: "antenatalvisits",
	},
];

function PatientDetailsPage() {
	const { id } = useParams();
	const navigate = useNavigate();
	const token = localStorage.getItem("token");
	const [patient, setPatient] = useState(null);
	const [sections, setSections] = useState({});
	const [expanded, setExpanded] = useState("");
	const [loadingSection, setLoadingSection] = useState("");
	const [showModal, setShowModal] = useState({ section: "", open: false });
	const [editItem, setEditItem] = useState(null);
	const [formData, setFormData] = useState({});
	const [error, setError] = useState("");

	useEffect(() => {
		axios
			.get(`${API_BASE_URL}/patients/${id}`, {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((res) => setPatient(res.data))
			.catch(() => setError("Failed to fetch patient info"));
	}, [id, token]);

	const fetchSection = async (sectionKey) => {
		setLoadingSection(sectionKey);
		const config = sectionConfigs.find((s) => s.key === sectionKey);
		if (!config) return;
		try {
			const res = await axios.get(`${API_BASE_URL}/${config.api}/patient/${id}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setSections((prev) => ({ ...prev, [sectionKey]: res.data }));
		} catch {
			setSections((prev) => ({ ...prev, [sectionKey]: [] }));
			setError(`Failed to fetch ${config.label}`);
		} finally {
			setLoadingSection("");
		}
	};

	const handleAdd = (sectionKey) => {
		setEditItem(null);
		setFormData({});
		setShowModal({ section: sectionKey, open: true });
	};

	const handleEdit = (sectionKey, item) => {
		setEditItem(item);
		setFormData(item);
		setShowModal({ section: sectionKey, open: true });
	};

	const handleFormChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => {
			const updated = {
				...prev,
				[name]: type === "checkbox" ? checked : value,
			};
			// Always ensure notes is present in formData for appointments
			if (showModal.section === "appointments" && name === "notes") {
				updated.notes = value;
			}
			return updated;
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const config = sectionConfigs.find((s) => s.key === showModal.section);
		if (!config) return;
		let url = `${API_BASE_URL}/${config.api}`;
		let method = editItem ? "put" : "post";
		let data = { ...formData, patientId: Number(id) };
		// Always ensure notes is included for appointments
		if (config.key === "appointments" && typeof formData.notes !== "undefined") {
			data.notes = formData.notes;
		}
		// For appointments, set createdBy to userId and doctorId to patient's doctorId
		if (config.key === "appointments") {
			const userId = localStorage.getItem("userId");
			if (userId) data.createdBy = Number(userId);
			if (patient && patient.doctorId) data.doctorId = patient.doctorId;
		}
		if (editItem && editItem.id) url += `/${editItem.id}`;
		// Convert date/datetime fields
		config.fields.forEach((f) => {
			if ((f.type === "date" || f.type === "datetime-local") && data[f.name]) {
				data[f.name] = new Date(data[f.name]).toISOString();
			}
		});
		console.log("Submitting data to API:", { url, method, data });
		try {
			await axios[method](url, data, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setShowModal({ section: "", open: false });
			setEditItem(null);
			setFormData({});
			fetchSection(config.key);
		} catch (err) {
			setError("Failed to save data. " + (err?.response?.data?.message || err.message || ""));
			console.error("API error:", err?.response?.data || err);
		}
	};

	return (
		<div className="flex flex-col items-center min-h-screen bg-gray-50">
			<div className="w-full max-w-6xl mt-8">
				<button className="mb-4 px-4 py-2 bg-gray-300 rounded" onClick={() => navigate(-1)}>
					Back
				</button>
				{error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
				{patient && (
					<div className="mb-6 p-6 bg-white rounded shadow text-center">
						<h2 className="text-3xl font-bold mb-2">
							{patient.firstName} {patient.lastName}
						</h2>
						<div className="text-gray-700 mb-1"><strong>Patient ID:</strong> {patient.id}</div>
						<div className="text-gray-700 mb-1"><strong>Gender:</strong> {patient.gender}</div>
						<div className="text-gray-700 mb-1"><strong>Phone:</strong> {patient.phone}</div>
						<div className="text-gray-700 mb-1"><strong>Email:</strong> {patient.email}</div>
						<div className="text-gray-700 mb-1"><strong>Date of Birth:</strong> {patient.dateOfBirth ? patient.dateOfBirth.split("T")[0] : ""}</div>
						<div className="text-gray-700 mb-1"><strong>Address:</strong> {patient.address}</div>
						<div className="text-gray-700 mb-1"><strong>Marital Status:</strong> {patient.maritalStatus}</div>
						<div className="text-gray-700 mb-1"><strong>Doctor:</strong> {patient.doctorName || ""}</div>
						<div className="text-gray-700 mb-1"><strong>Emergency Contact:</strong> {patient.emergencyContactName} {patient.emergencyContactPhone}</div>
					</div>
				)}
				{sectionConfigs.map((section) => (
					<div key={section.key} className="mb-10 flex justify-center">
						<div className="w-full max-w-6xl">
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
								<button
									className="mt-4 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
									onClick={() => handleAdd(section.key)}
								>
									Add
								</button>
							</div>
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
																						.filter((k) => {
																							// Hide 'prescriptions' column only from appointments table
																							if (section.key === "appointments" && k.toLowerCase() === "prescriptions") return false;
																							if (section.key === "appointments" && k.toLowerCase() === "createdby") return false;
																							return (
																								k !== "id" &&
																								k !== "patientId" &&
																								k !== "doctorId" &&
																								k !== "doctor" &&
																								k !== "patient" &&
																								k !== "createdByUser"
																							);
																						})
																						.map((k) => (
																							<th key={k} className="p-2 border font-normal text-gray-700">
																								{k.charAt(0).toUpperCase() + k.slice(1)}
																							</th>
																						))}
														<th className="p-2 border font-normal text-gray-700">Actions</th>
													</tr>
												</thead>
												<tbody>
													{sections[section.key].map((item) => (
														<tr key={item.id}>
																							{Object.keys(item)
																								.filter((k) => {
																									// Hide 'prescriptions' column only from appointments table
																									if (section.key === "appointments" && k.toLowerCase() === "prescriptions") return false;
																									if (section.key === "appointments" && k.toLowerCase() === "createdby") return false;
																									return (
																										k !== "id" &&
																										k !== "patientId" &&
																										k !== "doctorId" &&
																										k !== "doctor" &&
																										k !== "patient" &&
																										k !== "createdByUser"
																									);
																								})
																								.map((k) => (
																									<td key={k} className="p-2 border text-gray-800">
																										{(() => {
																											// Try to format ISO date/datetime strings
																											const value = item[k];
																											if (value && typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/)) {
																												const d = new Date(value);
																							 					return (
																													<>
																														{d.toLocaleDateString()}<br />
																														<span style={{ fontSize: '0.85em', color: '#666' }}>{d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
																													</>
																												);
																											}
																											if (typeof value === "string" && value.length > 25) {
																												return <TruncatedCell text={value} maxLength={25} label={k.charAt(0).toUpperCase() + k.slice(1)} />;
																											}
																											return value !== undefined ? String(value) : "";
																										})()}
																									</td>
																								))}
															<td className="p-2 border">
																<button
																	className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500 mr-2"
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
											<div className="text-gray-500 text-center">No records found.</div>
										)}
									</div>
								)}
							</div>
						</div>
					</div>
				))}
				{/* Add/Edit Modal */}
				{showModal.open && (
					<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
						<form
							onSubmit={handleSubmit}
							className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
						>
							<h2 className="text-xl font-bold mb-4 text-gray-700">
								{editItem ? "Edit" : "Add"} {sectionConfigs.find((s) => s.key === showModal.section)?.label}
							</h2>
							{sectionConfigs
								.find((s) => s.key === showModal.section)
								?.fields.map((field) => (
									<div className="mb-3" key={field.name}>
										<label className="block text-gray-700 mb-1">{field.label}</label>
										{field.type === "textarea" ? (
											<textarea
												name={field.name}
												value={formData[field.name] || ""}
												onChange={handleFormChange}
												className="w-full border rounded px-2 py-1"
											/>
										) : field.type === "checkbox" ? (
											<input
												type="checkbox"
												name={field.name}
												checked={!!formData[field.name]}
												onChange={handleFormChange}
												className="mr-2"
											/>
										) : (
											<input
												type={field.type}
												name={field.name}
												value={formData[field.name] || ""}
												onChange={handleFormChange}
												className="w-full border rounded px-2 py-1"
											/>
										)}
									</div>
								))}
							<div className="flex justify-end space-x-4 mt-4">
								<button
									type="button"
									onClick={() => {
										setShowModal({ section: "", open: false });
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
