using ClinicSystem.API.Models;


namespace ClinicSystem.API.Models
{
    public class Doctor
    {
        public int Id { get; set; }
        public string? FirstName { get; set; } 
        public string? LastName { get; set; } 
        public string? Gender { get; set; }
        public string? Specialty { get; set; } 
        public string? Phone { get; set; } 
        public String? Email { get; set; } 
        public String LicenseNumber { get; set; } = null!;
        public int? UserId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string? MaritalStatus { get; set; }
    
        public ICollection<Appointment>? Appointments { get; set; }
        public ICollection<MedicalRecord> DoctorMedicalRecords { get; set; } = new List<MedicalRecord>();
        public ICollection<Prescription>? Prescriptions { get; set; }

    }

}