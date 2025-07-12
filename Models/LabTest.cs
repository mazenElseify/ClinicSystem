using ClinicSystem.API.Models;


namespace ClinicSystem.API.Models
{
    public class LabTest
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public string TestName { get; set; } = null!;
        public string? Result { get; set; }
        public DateTime? ResultDate { get; set; }
        public int? RequestedByDoctorId { get; set; }
        public string? Notes { get; set; }


        public Patient Patient { get; set; } = null!;
        public Doctor? RequestedByDoctor { get; set; }
    }

}