namespace ClinicSystem.API.DTOs
{
    public class UserDto
    {
        public int Id { get; set; }
        public string UserName { get; set; } = null!;
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string Role { get; set; } = "Receptionist";
        public bool IsActive { get; set; } = true;

    }
    public class CreateUserDto
{
    public string UserName { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string Role { get; set; } = "Receptionist";
}
    public class UpdateUserDto
    {
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Role { get; set; }
        public bool IsActive { get; set; }
    }
}