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
            CreateMap<UpdateAppointmentDto, Appointment>();
            // MedicalRecord Mapper
            CreateMap<MedicalRecordDto, MedicalRecord>();

            CreateMap<UpdateMedicalRecordDto, MedicalRecord>()
                .ForMember(dest => dest.Id, opt => opt.Ignore());

            CreateMap<MedicalRecord, MedicalRecordDto>();
            // User Mapper
            CreateMap<UserDto, User>()
                .ForMember(dest => dest.CreatedAt, opt => opt.MapForm(src => DateTime.UtcNow))
                .ForMember(dest => dest.IsActive, opt => opt.MapForm(src => true));

            CreateMap<UpdateUserDto, User>()
                .ForMember(dest => dest.Id, opt => opt.Ignore());
            CreateMap<User, UserDto>();
        }
    }
}