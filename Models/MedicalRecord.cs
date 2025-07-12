public class MedicalRecord
{
    public int Id { get; set;}
    public int PatientId { get; set;}
    public int DoctorId { get; set;}
    public DateTime RecordDate { get; set;} = DateTime.Now;
    public string? diagnosis{ get; set;}
    public String? Symptoms { get; set;}    
    public string? Allergies { get; set;}
    public string? Medicaations { get; set;}
    public string? Notes { get; set;}
    
    public Patient Patient { get; set;} = null!;
    public Doctor Doctor { get; set;} = null!;
}