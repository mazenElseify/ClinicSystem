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
        public DbSet<GynecologicalHistory> GynecologicalHistories { get; set; }
        public DbSet<FileUpload> FileUploads { get; set; }
        public DbSet<AntenatalVisit> AntenatalVisits { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Patient>(entity =>
            {
                entity.ToTable("patient");

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.FirstName).HasColumnName("first_name");
                entity.Property(e => e.LastName).HasColumnName("last_name");
                entity.Property(e => e.DateOfBirth).HasColumnName("birth_date");
                entity.Property(e => e.Gender).HasColumnName("gender");
                entity.Property(e => e.Phone).HasColumnName("phone");
                entity.Property(e => e.Email).HasColumnName("email");
                entity.Property(e => e.Address).HasColumnName("address");
                entity.Property(e => e.MaritalStatus).HasColumnName("marital_status");
                entity.Property(e => e.EmergencyContactName).HasColumnName("emergency_contact_name");
                entity.Property(e => e.EmergencyContactPhone).HasColumnName("emergency_contact_phone");
                entity.Property(e => e.CreatedAt).HasColumnName("created_date");

                entity.HasMany(e => e.Appointments)
                    .WithOne(e => e.Patient)
                    .HasForeignKey(e => e.PatientId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasMany(e => e.PatientMedicalRecords)
                    .WithOne(e => e.Patient)
                    .HasForeignKey(e => e.PatientId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasMany(e => e.Prescriptions)
                    .WithOne(e => e.Patient)
                    .HasForeignKey(e => e.PatientId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasMany(e => e.Invoices)
                    .WithOne(e => e.Patient)
                    .HasForeignKey(e => e.PatientId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<Doctor>(entity =>
            {
                entity.ToTable("doctor");

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.FirstName).HasColumnName("first_name");
                entity.Property(e => e.LastName).HasColumnName("last_name");
                entity.Property(e => e.Gender).HasColumnName("gender");
                entity.Property(e => e.Specialty).HasColumnName("specialty");
                entity.Property(e => e.Phone).HasColumnName("phone");
                entity.Property(e => e.Email).HasColumnName("email");
                entity.Property(e => e.LicenseNumber).HasColumnName("license_number");
                entity.Property(e => e.UserId).HasColumnName("user_id");
                entity.Property(e => e.CreatedAt).HasColumnName("created_date");
                entity.Property(e => e.MaritalStatus).HasColumnName("marital_status");

                entity.HasMany(e => e.Appointments)
                    .WithOne(e => e.Doctor)
                    .HasForeignKey(e => e.DoctorId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasMany(e => e.DoctorMedicalRecords)
                    .WithOne(e => e.Doctor)
                    .HasForeignKey(e => e.DoctorId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasMany(e => e.Prescriptions)
                    .WithOne(e => e.Doctor)
                    .HasForeignKey(e => e.DoctorId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<Appointment>(entity =>
            {
                entity.ToTable("appointment");

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.AppointmentDateTime).HasColumnName("appointment_date_time");
                entity.Property(e => e.DoctorId).HasColumnName("doctor_id");
                entity.Property(e => e.PatientId).HasColumnName("patient_id");
                entity.Property(e => e.Status).HasColumnName("status");
                entity.Property(e => e.Reason).HasColumnName("reason");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
                entity.Property(e => e.CreatedBy).HasColumnName("created_by");

                entity.HasOne(e => e.Doctor)
                    .WithMany(e => e.Appointments)
                    .HasForeignKey(e => e.DoctorId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Patient)
                    .WithMany(e => e.Appointments)
                    .HasForeignKey(e => e.PatientId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.CreatedByUser)
                    .WithMany()
                    .HasForeignKey(e => e.CreatedBy)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<MedicalRecord>(entity =>
            {
                entity.ToTable("medical_record");

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.PatientId).HasColumnName("patient_id");
                entity.Property(e => e.DoctorId).HasColumnName("doctor_id");
                entity.Property(e => e.VisitDate).HasColumnName("visit_date");
                entity.Property(e => e.Diagnosis).HasColumnName("diagnosis");
                entity.Property(e => e.Symptoms).HasColumnName("symptoms");
                entity.Property(e => e.Treatment).HasColumnName("treatment");
                entity.Property(e => e.Allergies).HasColumnName("allergies");
                entity.Property(e => e.Medications).HasColumnName("medications");
                entity.Property(e => e.Notes).HasColumnName("notes");
                entity.Property(e => e.CreatedBy).HasColumnName("created_by");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");

                entity.HasOne(e => e.Patient)
                    .WithMany(e => e.PatientMedicalRecords)
                    .HasForeignKey(e => e.PatientId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Doctor)
                    .WithMany(e => e.DoctorMedicalRecords)
                    .HasForeignKey(e => e.DoctorId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.CreatedByUser)
                    .WithMany()
                    .HasForeignKey(e => e.CreatedBy)
                    .OnDelete(DeleteBehavior.Restrict);
            });
            modelBuilder.Entity<Pregnancy>(entity =>
            {
                entity.ToTable("pregnancy");

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.PatientId).HasColumnName("patient_id");
                entity.Property(e => e.StartDate).HasColumnName("start_date");
                entity.Property(e => e.ExpectedDueDate).HasColumnName("expected_due_date");
                entity.Property(e => e.IsHighRisk).HasColumnName("is_high_risk");
                entity.Property(e => e.Notes).HasColumnName("notes");

                entity.HasOne(e => e.Patient)
                    .WithMany()
                    .HasForeignKey(e => e.PatientId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(e => e.AntenatalVisits)
                    .WithOne(e => e.Pregnancy)
                    .HasForeignKey(e => e.PregnancyId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("users");

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.UserName).HasColumnName("user_name");
                entity.Property(e => e.PasswordHash).HasColumnName("password_hash");
                entity.Property(e => e.Email).HasColumnName("email");
                entity.Property(e => e.Phone).HasColumnName("phone");
                entity.Property(e => e.Role).HasColumnName("role");
                entity.Property(e => e.IsActive).HasColumnName("is_active");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            });
            modelBuilder.Entity<GynecologicalHistory>(entity =>
            {
                entity.ToTable("gynocological_history");

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.PatientId).HasColumnName("patient_id");
                entity.Property(e => e.ManarcheAge).HasColumnName("manarche_age");
                entity.Property(e => e.CycleLength).HasColumnName("cycle_length");
                entity.Property(e => e.CycleRegular).HasColumnName("cycle_regular");
                entity.Property(e => e.LastMenstralPeriod).HasColumnName("last_menstral_period");
                entity.Property(e => e.ContraceptiveUse).HasColumnName("contraceptive_use");
                entity.Property(e => e.PapSmearDate).HasColumnName("pap_smear_date");
                entity.Property(e => e.HpvStatus).HasColumnName("hpv_status");
                entity.Property(e => e.SexuallyActive).HasColumnName("sexually_active");
                entity.Property(e => e.Notes).HasColumnName("notes");

                entity.HasOne(e => e.Patient)
                    .WithMany()
                    .HasForeignKey(e => e.PatientId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
            modelBuilder.Entity<ObstetricHistory>(entity =>
            {
                entity.ToTable("obstetric_history");

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.PatientId).HasColumnName("patient_id");
                entity.Property(e => e.Gravida).HasColumnName("gravida");
                entity.Property(e => e.Para).HasColumnName("para");
                entity.Property(e => e.Abortions).HasColumnName("abortions");
                entity.Property(e => e.LivingChildren).HasColumnName("living_children");
                entity.Property(e => e.EctopicPregnancies).HasColumnName("ectopic_pregnancies");
                entity.Property(e => e.Stillbirths).HasColumnName("stillbirths");
                entity.Property(e => e.LastDeliveryDate).HasColumnName("last_delivery_date");
                entity.Property(e => e.DeliveryType).HasColumnName("delivery_type");
                entity.Property(e => e.Complications).HasColumnName("complications");

                entity.HasOne(e => e.Patient)
                    .WithMany()
                    .HasForeignKey(e => e.PatientId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
            modelBuilder.Entity<AntenatalVisit>(entity =>
            {
                entity.ToTable("antenatal_visit");

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.PregnancyId).HasColumnName("pregnancy_id");
                entity.Property(e => e.VisitDate).HasColumnName("visit_date");
                entity.Property(e => e.BloodPresure).HasColumnName("blood_presure");
                entity.Property(e => e.Weight).HasColumnName("weight");
                entity.Property(e => e.FetalHeartRate).HasColumnName("fetal_heart_rate");
                entity.Property(e => e.UrineTestResult).HasColumnName("urine_test_result");
                entity.Property(e => e.DoctorNotes).HasColumnName("doctor_notes");

                entity.HasOne(e => e.Pregnancy)
                    .WithMany(e => e.AntenatalVisits)
                    .HasForeignKey(e => e.PregnancyId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
            modelBuilder.Entity<LabTest>(entity =>
            {
                entity.ToTable("lab_test");

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.PatientId).HasColumnName("patient_id");
                entity.Property(e => e.TestName).HasColumnName("test_name");
                entity.Property(e => e.Result).HasColumnName("result");
                entity.Property(e => e.ResultDate).HasColumnName("result_date");
                entity.Property(e => e.RequestedByDoctorId).HasColumnName("requested_by_doctor_id");
                entity.Property(e => e.Notes).HasColumnName("notes");

                entity.HasOne(e => e.Patient)
                    .WithMany(e => e.LabTests)
                    .HasForeignKey(e => e.PatientId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.RequestedByDoctor)
                    .WithMany()
                    .HasForeignKey(e => e.RequestedByDoctorId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
            modelBuilder.Entity<Prescription>(entity =>
            {
                entity.ToTable("prescription");

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.AppointmentId).HasColumnName("appointment_id");
                entity.Property(e => e.PatientId).HasColumnName("patient_id");
                entity.Property(e => e.DoctorId).HasColumnName("doctor_id");
                entity.Property(e => e.PrescriptionDate).HasColumnName("prescription_date");
                entity.Property(e => e.MedicationName).HasColumnName("medication_name");
                entity.Property(e => e.Dosage).HasColumnName("dosage");
                entity.Property(e => e.Frequency).HasColumnName("frequency");
                entity.Property(e => e.Duration).HasColumnName("duration");
                entity.Property(e => e.Instructions).HasColumnName("instructions");

                entity.HasOne(e => e.Appointment)
                    .WithMany(e => e.Prescriptions)
                    .HasForeignKey(e => e.AppointmentId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Patient)
                    .WithMany(e => e.Prescriptions)
                    .HasForeignKey(e => e.PatientId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Doctor)
                    .WithMany(e => e.Prescriptions)
                    .HasForeignKey(e => e.DoctorId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
            modelBuilder.Entity<FileUpload>(entity =>
            {
                entity.ToTable("file_upload");

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.PatientId).HasColumnName("patient_id");
                entity.Property(e => e.FileName).HasColumnName("file_name");
                entity.Property(e => e.FileType).HasColumnName("file_type");
                entity.Property(e => e.UploadDate).HasColumnName("upload_date");
                entity.Property(e => e.UploadedBy).HasColumnName("uploaded_by");
                entity.Property(e => e.Description).HasColumnName("description");
                entity.Property(e => e.FilePath).HasColumnName("file_path");

                entity.HasOne(e => e.Patient)
                    .WithMany(e => e.FileUploads)
                    .HasForeignKey(e => e.PatientId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.UploadedByUser)
                    .WithMany()
                    .HasForeignKey(e => e.UploadedBy)
                    .OnDelete(DeleteBehavior.Restrict);
            });
            modelBuilder.Entity<Invoice>(entity =>
            {
                entity.ToTable("invoice");

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.PatientId).HasColumnName("patient_id");
                entity.Property(e => e.AppointmentId).HasColumnName("appointment_id");
                entity.Property(e => e.IssueDate).HasColumnName("issue_date");
                entity.Property(e => e.TotalAmount).HasColumnName("total_amount");
                entity.Property(e => e.PaidAmount).HasColumnName("paid_amount");
                entity.Property(e => e.Status).HasColumnName("status");
                entity.Property(e => e.PaymentMethod).HasColumnName("payment_method");
                entity.Property(e => e.Notes).HasColumnName("notes");

                entity.HasOne(e => e.Patient)
                    .WithMany(e => e.Invoices)
                    .HasForeignKey(e => e.PatientId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Appointment)
                    .WithMany(e => e.Invoices)
                    .HasForeignKey(e => e.AppointmentId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
            modelBuilder.Entity<Notification>(entity =>
            {
                entity.ToTable("notification");

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.UserId).HasColumnName("user_id");
                entity.Property(e => e.Message).HasColumnName("message");
                entity.Property(e => e.IsRead).HasColumnName("is_read");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
                entity.Property(e => e.TargetDate).HasColumnName("target_date");

                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });



        }
    }
}
// create model builder for this model named in snake_case for database
