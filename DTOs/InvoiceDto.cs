namespace ClinicSystem.API.DTOs
{
    public class InvoiceDto
    {
        public int PatientId { get; set; }
        public int AppointmentId { get; set; }
        public DateTime IssueDate { get; set; } = DateTime.UtcNow;
        public decimal TotalAmount { get; set; }
        public decimal PaidAmount { get; set; } = 0;
        public string Status { get; set; } = "Unpaid";
        public string? PaymentMethod { get; set; }
        public string? Notes { get; set; }

    }
    public class UpdateInvoiceDto
    {
        public decimal PaidAmount { get; set; }
        public string? Status { get; set; }
        public string? PaymentMethod { get; set; }
        public string? Notes { get; set; }
    }
    public class InvoiceDetailsDto
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public int AppointmentId { get; set; }
        public DateTime IssueDate { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal PaidAmount { get; set; }
        public string? Status { get; set; }
        public string? PaymentMethod { get; set; }
        public string? Notes { get; set; }

        public string? PatientName { get; set; }
        public DateTime? AppointmentDate { get; set; }
    }
}