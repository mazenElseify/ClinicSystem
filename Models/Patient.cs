using ClinicSystem.API.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace ClinicSystem.API.Models
{
    public class Patient
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;

        [Column(TypeName = "date")]
        public DateTime? DateOfBirth { get; set; }
        public string Gender { get; set; } = null!;
        public string? Phone { get; set; }
        public String? Email { get; set; }
        public string? Address { get; set; }
        public string? MaritalStatus { get; set; }
        public string? EmergencyContactName { get; set; }
        public string? EmergencyContactPhone { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;


        public ICollection<Appointment>? Appointments { get; set; }
        public ICollection<MedicalRecord> PatientMedicalRecords { get; set; } = new List<MedicalRecord>();

        public ICollection<Prescription>? Prescriptions { get; set; }
        public ICollection<Invoice>? Invoices { get; set; }
        public ICollection<LabTest>? LabTests { get; set; }
        public ICollection<FileUpload>? FileUploads { get; set; }



    }

}