namespace ClinicSystem.API.DTOs
{
    public class LabTestDto
    {
        public int PatientId { get; set; }
        public string TestName { get; set; } = null!;
        public string? Result { get; set; }
        public DateTime? ResultDate { get; set; }
        public int? RequestedByDoctorId { get; set; }
        public string? Notes { get; set; }

    }
    public class UpdateLabTestDto
    {
        public string TestName { get; set; } = null!;
        public string? Result { get; set; }
        public DateTime? ResultDate { get; set; }
        public int? RequestedByDoctorId { get; set; }
        public string? Notes { get; set; }


    }
    public class LabTestDetailsDto
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public string TestName { get; set; } = null!;
        public string? Result { get; set; }
        public DateTime? ResultDate { get; set; }
        public int? RequestedDoctorId { get; set; }
        public string? Notes { get; set; }

    }
}