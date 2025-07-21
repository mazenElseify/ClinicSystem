namespace ClinicSystem.API.DTOs
{
    public class GynecologicalHistoryDto
    {
        public int PatientId { get; set; }
        public int? ManarcheAge { get; set; }
        public int? CycleLength { get; set; }
        public bool? CycleRegular { get; set; }
        public DateTime? LastMenstralPeriod { get; set; }
        public string? ContraceptiveUse { get; set; }
        public DateTime? PapSmearDate { get; set; }
        public string? HpvStatus { get; set; }
        public bool? SexuallyActive { get; set; }
        public string? Notes { get; set; }
    }

    public class UpdateGynecologicalHistoryDto
    {
        public int? ManarcheAge { get; set; }
        public int? CycleLength { get; set; }
        public bool? CycleRegular { get; set; }
        public DateTime? LastMenstralPeriod { get; set; }
        public string? ContraceptiveUse { get; set; }
        public DateTime? PapSmearDate { get; set; }
        public string? HpvStatus { get; set; }
        public bool? SexuallyActive { get; set; }
        public string? Notes { get; set; }
    }

    public class GynecologicalHistoryDetailsDto
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public int? ManarcheAge { get; set; }
        public int? CycleLength { get; set; }
        public bool? CycleRegular { get; set; }
        public DateTime? LastMenstralPeriod { get; set; }
        public string? ContraceptiveUse { get; set; }
        public DateTime? PapSmearDate { get; set; }
        public string? HpvStatus { get; set; }
        public bool? SexuallyActive { get; set; }
        public string? Notes { get; set; }

        public string? PatientName { get; set; }
    }
}
