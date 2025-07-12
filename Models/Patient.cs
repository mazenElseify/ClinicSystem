public class Patient
{
    public int PatientId {get; set;}
    public string FirstName {get; set;} = null!;
    public string LastName {get; set;} = null!;
    public DateTime DateOfBirth {get; set;}
    public string Gender {get; set;} = null!;
    public string? Phone {get; set;} 
    public String? Email {get; set;}
    public string? Address {get; set;}
    public string? MaritalStatus {get; set;}
    public string? Occupation {get; set;}
    public string? EmergencyContactName {get; set;}
    public string? EmergencyContactPhone {get; set;}
    public DateTime CreatedAt {get; set;} = DateTime.Now;
    

    public ICollection<Appointment>? Appointments { get; set; }
    public ICollection<MedicalRecord>? MedicalRecords { get; set; }
    public ICollection<Prescription>? Prescriptions { get; set; }
    public ICollection<Invoice>? Invoices { get; set; }

}