using AutoMapper;
using ClinicSystem.API.DTOs;
using ClinicSystem.API.Models;

namespace ClinicSystem.API.Mapping
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            // Appointment Mapper
            CreateMap<AppointmentDto, Appointment>()
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow));
            CreateMap<UpdateAppointmentDto, Appointment>()
                .ForMember(dest => dest.Id, opt => opt.Ignore());
            CreateMap<Appointment, AppointmentDto>();

            // MedicalRecord Mapper
            CreateMap<MedicalRecordDto, MedicalRecord>();
            CreateMap<UpdateMedicalRecordDto, MedicalRecord>()
                .ForMember(dest => dest.Id, opt => opt.Ignore());
            CreateMap<MedicalRecord, MedicalRecordDto>();
            // User Mapper
            CreateMap<CreateUserDto, User>();
            CreateMap<UserDto, User>()
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => true));
            CreateMap<UpdateUserDto, User>()
                .ForMember(dest => dest.Id, opt => opt.Ignore());
            CreateMap<User, UserDto>();

            // Pregnancy
            CreateMap<PregnancyDto, Pregnancy>();
            CreateMap<UpdatePregnancyDto, Pregnancy>()
                .ForMember(dest => dest.Id, opt => opt.Ignore());
            CreateMap<Pregnancy, PregnancyDto>();

            // AntenatalVisit
            CreateMap<AntenatalVisitDto, AntenatalVisit>();
            CreateMap<UpdateAntenatalVisitDto, AntenatalVisit>()
                .ForMember(dest => dest.Id, opt => opt.Ignore());
            CreateMap<AntenatalVisit, AntenatalVisitDto>();

            // LabTest
            CreateMap<LabTestDto, LabTest>();
            CreateMap<UpdateLabTestDto, LabTest>()
                .ForMember(dest => dest.Id, opt => opt.Ignore());
            CreateMap<LabTest, LabTestDto>();

            // GynecologicalHistory
            CreateMap<GynecologicalHistoryDto, GynecologicalHistory>();
            CreateMap<UpdateGynecologicalHistoryDto, GynecologicalHistory>()
                .ForMember(dest => dest.Id, opt => opt.Ignore());
            CreateMap<GynecologicalHistory, GynecologicalHistoryDto>();

            // ObstetricalHistory
            CreateMap<ObstetricHistoryDto, ObstetricHistory>();
            CreateMap<UpdateObstetricHistoryDto, ObstetricHistory>()
                .ForMember(dest => dest.Id, opt => opt.Ignore());
            CreateMap<ObstetricHistory, ObstetricHistoryDto>();

            // Prescription
            CreateMap<PrescriptionDto, Prescription>();
            CreateMap<UpdatePrescriptionDto, Prescription>()
                .ForMember(dest => dest.Id, opt => opt.Ignore());
            CreateMap<Prescription, PrescriptionDto>();

            // Invoice
            CreateMap<InvoiceDto, Invoice>();
            CreateMap<UpdateInvoiceDto, Invoice>()
                .ForMember(dest => dest.Id, opt => opt.Ignore());
            CreateMap<Invoice, InvoiceDto>();

            // FileUpload
            CreateMap<FileUploadDto, FileUpload>();
            CreateMap<UpdateFileUploadDto, FileUpload>()
                .ForMember(dest => dest.Id, opt => opt.Ignore());
            CreateMap<FileUpload, FileUploadDto>();

            // Notification 
            CreateMap<NotificationDto, Notification>();
            CreateMap<UpdateNotificationDto, Notification>()
                .ForMember(dest => dest.Id, opt => opt.Ignore());
            CreateMap<Notification, NotificationDto>();
            

        }
    }
}