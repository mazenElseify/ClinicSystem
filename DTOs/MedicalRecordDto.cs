namespace ClinicSystem.API.DTOs
{
    public class MedicalRecordDto
    {
        public int PatientId { get; set; }
        public int DoctorId { get; set; }
        public DateTime VisitDate { get; set; }
        public string? Diagnosis { get; set; }
        public string? Symptoms { get; set; }
        public string? Treatment { get; set; }
        public string? Allergies { get; set; }
        public string? Medications { get; set; }
        public int? CreatedBy { get; set; }

    }
    public class UpdateMedicalRecordDto
    {
        // public int Id { get; set; }
        // public int PatientId { get; set; }
        // public int DoctorId { get; set; }
        public DateTime VisitDate { get; set; }
        public string? Diagnosis { get; set; }
        public string? Symptoms { get; set; }
        public string? Treatment { get; set; }
        public string? Allergies { get; set; }
        public string? Medications { get; set; }
        public string? Notes { get; set; }

    }
    public class MedicalRecordDetailsDto
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public int DoctorId { get; set; }
        public DateTime VisitDate { get; set; }
        public string? Diagnosis { get; set; }
        public string? Symptoms { get; set; }
        public string? Treatment { get; set; }
        public string? Allergies { get; set; }
        public string? Medications { get; set; }
        public string? Notes { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
    }

}