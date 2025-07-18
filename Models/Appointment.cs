using ClinicSystem.API.Models;


namespace ClinicSystem.API.Models
{
    public class Appointment
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public int DoctorId { get; set; }

        // [Column(TypeName = "timestamp without time zone")]
        public DateTime AppointmentDateTime { get; set; }
        public string Status { get; set; } = "Scheduled";
        public string? Reason { get; set; }
        public int? CreatedBy { get; set; }
        
        // [Column(TypeName = "timestamp without time zone")]
        public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;

        // [JsonIgnore]
        public Patient Patient { get; set; } = null!;

        // [JsonIgnore]
        public Doctor Doctor { get; set; } = null!;

        // [JsonIgnore]
        public User? CreatedByUser { get; set; }
    }

}