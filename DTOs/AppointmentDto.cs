namespace ClinicSystem.API.DTOs
{
    public class AppointmentDto
    {
        public int PatientId { get; set; }
        public int DoctorId { get; set; }
        public DateTime AppointmentDateTime { get; set; }
        public string Status { get; set; } = "Scheduled";
        public string? Reason { get; set; }
        public int? CreatedBy { get; set; }
    }
    public class UpdateAppointmentDto
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public int DoctorId { get; set; }
        public DateTime AppointmentDateTime { get; set; }
        public string Status { get; set; } = "Scheduled";
        public string? Reason { get; set; }
        public int? CreatedBy { get; set; }
    }
}