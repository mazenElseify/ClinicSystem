namespace ClinicSystem.API.DTOs
{
    public class PrescriptionDto
    {
        public int AppointmentId { get; set; }
        public int PatientId { get; set; }
        public int DoctorId { get; set; }
        public DateTime PrescriptionDate { get; set; } = DateTime.Utc.Now;
        public string MedicationName { get; set; } = null!;
        public string? Dosage { get; set; }
        public string? Frequency { get; set; }
        public string? Duration { get; set; }
        public string? Instructions { get; set; }


    }
    public class UpdatePrescriptionDto
    {
        public string MedicationName { get; set; }
        public string? Dosage { get; set; }
        public string? Frequency { get; set; }
        public string? Duration { get; set; }
        public string? Instructions { get; set; }
    }
    public class PrescriptionDetailsDto
    {
        public int Id { get; set; }
        public int AppointmentId { get; set; }
        public int PatientId { get; set; }
        public int DoctorId { get; set; }
        public DateTime PrescriptionDate { get; set; }
        public string MedicationNaem { get; set; }
        public string? Dosage { get; set; }
        public string? Frequency { get; set; }
        public string? Duration { get; set; }
        public string? Instructions { get; set; }

        public string? DoctrorName { get; set; }
        public string? PatientName { get; set; }

    }
}