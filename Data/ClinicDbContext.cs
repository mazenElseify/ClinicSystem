using Microsoft.EntityFrameworkCore;
using ClinicSystem.API.Models;

namespace ClinicSystem.API.Data
{
    public class ClinicDbContext : DbContext
    {
        public ClinicDbContext(DbContextOptions<ClinicDbContext> options) : base(options) { }

        public DbSet<Patient> Patients { get; set; }
        public DbSet<Doctor> Doctors { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<MedicalRecord> MedicalRecords { get; set; }
        public DbSet<Prescription> Prescriptions { get; set; }
        public DbSet<Invoice> Invoices { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Pregnancy> Pregnancies { get; set; }
        public DbSet<ObstetricHistory> ObstetricHistories { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<LabTest> LabTests { get; set; }
        public DbSet<GynocologicalHistory> GynocologicalHistories { get; set; }
        public DbSet<FileUpload> FileUploads { get; set; }
        public DbSet<AntenatalVisit> AntenatalVisits { get; set; }



    }
}