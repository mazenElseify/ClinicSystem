public class AntenatalVisit
{
    public int Id { get; set; }
    public int PregnancyId { get; set; }
    public DateTime VisitDate { get; set; }
    public string? BloodPresure { get; set; }
    public decimal? Weight { get; set; }
    public int? FetalHeartRate { get; set; }
    public string? UrineTestResult { get; set; }
    public string? DoctorNotes { get; set; }


    public Pregnancy Pregnancy { get; set; } = null!;
}