namespace ClinicSystem.API.DTOs
{
    public class LabTestDto
    {
        public int PatientId { get; set; }
        public string TestName { get; set; } = null!;
        public string? Result { get; set; }
        public dateTime? ResultDate { get; set; }
        public int? RequestByDoctorId { get; set; }
        public string? Notes { get; set; }

    }
    public class UpdateLabTestDto
    {
        public string TestName { get; set; } = null!;
        public string? Result { get; set; }
        public DateTime ResultDate { get; set; }
        public int? RequestedDoctorId { get; set; }
        public string? Notes { get; set; }


    }
    public class LabtestDedailsDto
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