
namespace ClinicSystem.API.Models
{ 
    public class Pregnancy
    {
        public int id { get; set; }
        public int PatientId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime ExpectedDueDate { get; set; }
        public bool IsHighRisk { get; set; } = false;
        public string? Notes { get; set; }


        public Patient Patient { get; set; } = null!;
        public ICollection<AntenatalVisit>? AntenatalVisits { get; set; }
    }

}