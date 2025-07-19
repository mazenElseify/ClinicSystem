using ClinicSystem.API.Models;


namespace ClinicSystem.API.Models
{
    public class MedicalRecord
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public int DoctorId { get; set; }
        public DateTime VisitDate { get; set; } = DateTime.Now;
        public string? Diagnosis { get; set; }
        public String? Symptoms { get; set; }
        public string? Allergies { get; set; }
        public string? Medications { get; set; }
        public string? Notes { get; set; }

        public Patient Patient { get; set; } = null!;
        public Doctor Doctor { get; set; } = null!;
    }

}