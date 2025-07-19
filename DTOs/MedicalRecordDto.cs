namespace ClinicSystem.API.DTOs
{
    public class MedicalRecordDto
    {
        public int PatientId { get; set; }
        public int DoctorId { get; set; }
        public DateTime VisitDate { get; set; }
        public string? Diagnosis { get; set; }
        public string? Treatment { get; set; }
        public int? CreatedBy { get; set; }

    }
    public class UpdateMedicalRecordDto
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public int DoctorId { get; set; }
        public DateTime VisitDate { get; set; }
        public string? Diagnosis { get; set; }
        public string? Treatment { get; set; }
        public int? CretedBy { get; set; }
        
    }
}