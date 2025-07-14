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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Doctor>(entity =>
            {
                entity.ToTable("doctor");

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.FirstName).HasColumnName("first_name");
                entity.Property(e => e.LastName).HasColumnName("last_name");
                entity.Property(e => e.Email).HasColumnName("email");
                entity.Property(e => e.Phone).HasColumnName("phone");
                entity.Property(e => e.Specialty).HasColumnName("specialty");
                entity.Property(e => e.Gender).HasColumnName("gender");
                entity.Property(e => e.LicenseNumber).HasColumnName("license_number");
                entity.Property(e => e.UserId).HasColumnName("user_id");
                entity.Property(e => e.CreatedAt).HasColumnName("created_date");
                entity.Property(e => e.MaritalStatus).HasColumnName("marital_status");
            });
            modelBuilder.Entity<Patient>().ToTable("patient");
        }
    }
}
