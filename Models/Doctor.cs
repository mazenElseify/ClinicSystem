using ClinicSystem.API.Models;


namespace ClinicSystem.API.Models
{
    public class Doctor
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;

        public string Specialization { get; set; } = null!;
        public string? Phone { get; set; }
        public String? Email { get; set; }
        public String LicenseNumber { get; set; } = null!;
        public int? UserId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public User? User { get; set; }
        public ICollection<Appointment>? Appointments { get; set; }
        public ICollection<MedicalRecord>? MedicalRecords { get; set; }
        public ICollection<Prescription>? prescriptions { get; set; }

    }

}