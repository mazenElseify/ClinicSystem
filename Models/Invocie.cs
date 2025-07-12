namespace ClinicSystem.API.Models
{ 
    public class Invoice
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public int AppointmentId { get; set; }
        public DateTime IssueDate { get; set; } = DateTime.Now;
        public decimal TotalAmount { get; set; }
        public decimal PaidAmount { get; set; } = 0;
        public string Status { get; set; } = "Unpaid";
        public string? PaymentMethod { get; set; }
        public string? Notes { get; set; }

        public Patient Patient { get; set; } = null!;
        public Appointment Appointment { get; set; } = null!;

    }

}