using ClinicSystem.API.Models;


namespace ClinicSystem.API.Models
{
    public class User
    {
        public int Id { get; set; }
        public string UserName { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string Role { get; set; } = "Receptionist";
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.Now;

    }
}