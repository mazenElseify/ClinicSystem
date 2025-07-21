namespace ClinicSystem.API.DTOs
{
    public class ObstetricHistoryDto
    {
        public int PatientId { get; set; }
        public int Gravida { get; set; }
        public int Para { get; set; }
        public int Abortions { get; set; }
        public int LivingChildren { get; set; }
        public int EctopicPregnancies { get; set; }
        public int Stillbirths { get; set; }
        public DateTime? LastDeliveryDate { get; set; }
        public string? DeliveryType { get; set; }
        public string? Complications { get; set; }
    }

    public class UpdateObstetricHistoryDto
    {
        public int Gravida { get; set; }
        public int Para { get; set; }
        public int Abortions { get; set; }
        public int LivingChildren { get; set; }
        public int EctopicPregnancies { get; set; }
        public int Stillbirths { get; set; }
        public DateTime? LastDeliveryDate { get; set; }
        public string? DeliveryType { get; set; }
        public string? Complications { get; set; }
    }

    public class ObstetricHistoryDetailsDto
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public int Gravida { get; set; }
        public int Para { get; set; }
        public int Abortions { get; set; }
        public int LivingChildren { get; set; }
        public int EctopicPregnancies { get; set; }
        public int Stillbirths { get; set; }
        public DateTime? LastDeliveryDate { get; set; }
        public string? DeliveryType { get; set; }
        public string? Complications { get; set; }

        public string? PatientName { get; set; }
    }
}
