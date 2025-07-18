using AutoMapper;
using ClinicSystem.API.DTOs;
using ClinicSystem.API.Models;

namespace ClinicSystem.API.Mapping
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<AppointmentDto, Appointment>()
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow));
            CreateMap<UpdateAppointmentDto, Appointment>();
        }
    }
}