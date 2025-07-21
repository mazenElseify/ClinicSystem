public class DoctorDto
{
    public int Id { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Gender { get; set; }
    public string? Specialty { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string LicenseNumber { get; set; } = null!;
    public int? UserId { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? MaritalStatus { get; set; }
}

public class CreateDoctorDto
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Gender { get; set; }
    public string? Specialty { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string LicenseNumber { get; set; } = null!;
    public int? UserId { get; set; }
    public string? MaritalStatus { get; set; }
}

public class UpdateDoctorDto
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Gender { get; set; }
    public string? Specialty { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? LicenseNumber { get; set; }
    public int? UserId { get; set; }
    public string? MaritalStatus { get; set; }
}
