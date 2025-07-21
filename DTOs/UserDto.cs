namespace ClinicSystem.DTOs
{
    public class UserDto
    {
        public int Id { get; set; }
        public string UserName { get; set; } = null!;
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string Role { get; set; } = "Reciptionist";
        public bool IsActive { get; set; } = true;
        
    }
}