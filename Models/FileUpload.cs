using ClinicSystem.API.Models;


namespace ClinicSystem.API.Models
{
    public class FileUpload
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public string FileName { get; set; } = null!;
        public string FileType { get; set; } = null!;
        public DateTime UploadDate { get; set; } = DateTime.Now;
        public int? UploadedBy { get; set; }
        public string? Description { get; set; }
        public string? FilePath { get; set; } = null!;


        public Patient Patient { get; set; } = null!;
        public User? UploadedByUser { get; set; }
    }

}