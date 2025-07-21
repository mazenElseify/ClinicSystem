namespace ClinicSystem.API.DTOs
{
    public class PregnancyDto
    {
        public int PatientId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime ExpectedDueDate { get; set; }
        public bool IsHighRisk { get; set; } = false;
        public string? Notes { get; set; }
    }
    public class UpdatePregnancyDto
    {
        public DateTime StartDate { get; set; }
        public DateTime ExpectedDueDate { get; set; }
        public bool IsHighRisk { get; set; } = false;
        public string? Notes { get; set; }

    }
    public class PregnancyDetailsDto
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime ExpectedDueDate { get; set; }
        public bool IsHighRisk { get; set; } = false;
        public string? Notes { get; set; }
        public List<AntenatalVisitDto>? AtenatalVisits { get; set; }
    }
}