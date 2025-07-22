namespace CLinicSytem.API.DTOs
{
    public class FileUploadDto
    {
        public int PatientId { get; set; }
        public string FileName { get; set; } = null!;
        public string FileType { get; set; } = null!;
        public DateTime UploadDate { get; set; } = DateTime.UtcNow;
        public int? UploaderBy { get; set; }
        public string? Description { get; set; }
        public string? FilePath { get; set; } = null!;

    }
    public class UpdateFileUploadDto
    {
        public string? Description { get; set; }
        public string? FilePath { get; set; }
    }
    public class FileUploadDetailsDto
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public string FileName { get; set; }
        public string FileType { get; set; }
        public DateTime UploadDate { get; set; }
        public int? UploadedBy { get; set; }
        public string? UploadedByUserName { get; set; }
        public string? Description { get; set; }
        public string? FilePAth { get; set; }
        

    }
}