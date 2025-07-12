namespace ClinicSystem.API.Models
{ 
    public class Appointment
    {
        public int AppointmentId { get; set; }
        public int PatientId { get; set; }
        public int DoctorId { get; set; }
        public DateTime AppointmentDateTime { get; set; }
        public string Status { get; set; } = "Scheduled";
        public string? Reason { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public Patient Patient { get; set; } = null!;
        public Doctor Doctor { get; set; } = null!;
        public User? CreatedByUser { get; set; }
    }

}