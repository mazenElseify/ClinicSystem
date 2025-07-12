using Microsoft.EntityFrameworkCore;
using ClinicSystem.API.Models;

namespace ClinicSystem.API.Data
{
    public class ClinicDbContext : DbContext
    {
        public ClinicDbContext(DbContextOptions<ClinicDbContext> options) : base(options) { }

        public DbSet<Patient> Patient { get; set; }
        public DbSet<Doctor> Doctor { get; set; }
        public DbSet<Appointment> Appointment { get; set; }
        public DbSet<MedicalRecord> MedicalRecords { get; set; }
        public DbSet<Prescription> Prescription { get; set; }
        public DbSet<Invoice> Invoices { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Pregnancy> Pregnancy { get; set; }
        public DbSet<ObstetricHistory> ObstetricHistory { get; set; }
        public DbSet<Notification> notification { get; set; }
        public DbSet<LabTest> labTest { get; set; }
        public DbSet<GynocologicalHistory> GynocologicalHistory { get; set; }
        public DbSet<FileUpload> fileUpload { get; set; }
        public DbSet<AntenatalVisit> AntenatalVisit { get; set; }



    }
}