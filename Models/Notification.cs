using ClinicSystem.API.Models;


namespace ClinicSystem.API.Models
{
    public class Notification
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Message { get; set; } = null!;
        public bool IsRead { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime TargetDate { get; set; }


        public User User { get; set; } = null!;
    }

}