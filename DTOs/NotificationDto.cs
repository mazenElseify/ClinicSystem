namespace ClinicSystem.API.DTOs
{
    public class NotificationDto
    {
        public int UserId { get; set; }
        public string Message { get; set; } = null!;
        public DateTime TargetDate { get; set; }

    }
    public class UpdateNotificationDto
    {
        public bool IsRead { get; set; }
    }
    public class NotificationDetailsDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Message { get; set; } = null!;
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime TargetDate { get; set; }

        public string? UserName { get; set; }

    }
 }