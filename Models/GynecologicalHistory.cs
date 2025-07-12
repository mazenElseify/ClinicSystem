namespace ClinicSysteem.API.Models
{ 
    public class GynocologicalHistory
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public int? manarcheAge { get; set; }
        public int? CycleLength { get; set; }
        public bool? CycleRegular { get; set; }
        public DateTime? LastMenstralPeriod { get; set; }
        public string? ContraceptiveUse { get; set; }
        public DateTime? PapSmearDate { get; set; }
        public string? HpvStatus { get; set; }
        public bool? SexuallyActive { get; set; }
        public string? Notes { get; set; }


        public Patient Patient { get; set; } = null!;

    }

}