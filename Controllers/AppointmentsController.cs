using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ClinicSystem.API.Data;
using ClinicSystem.API.Models;
using AutoMapper;
using ClinicSystem.API.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace ClinicSystem.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentsController : ControllerBase
    {
        private readonly ClinicDbContext _context;
        private readonly IMapper _mapper;

        public AppointmentsController(ClinicDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;

        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AppointmentDetailsDto>>> GetAllAppointments()
        {
            var appointments = await _context.Appointments
                .Include(a => a.Patient)
                .Include(a => a.Doctor)
                .ToListAsync();
            var appointmentDtos = appointments.Select(a => new AppointmentDetailsDto
            {
                Id = a.Id,
                PatientId = a.PatientId,
                DoctorId = a.DoctorId,
                AppointmentDateTime = a.AppointmentDateTime,
                Status = a.Status,
                Reason = a.Reason,
                Notes = a.Notes,
                CreatedAt = a.CreatedAt ?? DateTime.MinValue,
                CreatedBy = a.CreatedBy,
                // Add patient and doctor names for frontend display
                PatientName = a.Patient != null ? a.Patient.FirstName + " " + a.Patient.LastName : null,
                DoctorName = a.Doctor != null ? a.Doctor.FirstName + " " + a.Doctor.LastName : null
            }).ToList();
            return appointmentDtos;
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Appointment>> GetAppointment(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);

            if (appointment == null)
                return NotFound();

            return Ok(appointment);
        }
        [HttpPost]
        public async Task<ActionResult<Appointment>> CreateAppointment(AppointmentDto appointmentDto)
        {
            // Manual mapping to ensure DoctorId and PatientId are set correctly
            var appointment = new Appointment
            {
                DoctorId = appointmentDto.DoctorId,
                PatientId = appointmentDto.PatientId,
                AppointmentDateTime = appointmentDto.AppointmentDateTime,
                Reason = appointmentDto.Reason,
                Status = appointmentDto.Status,
                CreatedBy = appointmentDto.CreatedBy,
                CreatedAt = DateTime.UtcNow
            };
            _context.Appointments.Add(appointment);
            appointment.AppointmentDateTime = appointment.AppointmentDateTime.ToUniversalTime();
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAppointment), new { id = appointment.Id }, appointment);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAppointment(int id, UpdateAppointmentDto appointment)
        {
            if (id != appointment.Id)
                return BadRequest();

            var existingAppointment = await _context.Appointments.FindAsync(id);
            if (existingAppointment == null)
                return NotFound();

            _mapper.Map(appointment, existingAppointment);
            // _context.Entry(existingAppointment).CurrentValues.SetValues(appointment);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Appointments.Any(e => e.Id == id))
                    return NotFound();
                else
                    throw;
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAppointment(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
                return NotFound();

            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        // GET: api/appointments/patient/5
        [HttpGet("patient/{patientId}")]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetAppointmentByPatient(int patientId)
        {
            return await _context.Appointments
                .Where(a => a.PatientId == patientId)
                .ToListAsync();
        }
        [HttpGet("doctor/{doctorId}")]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetAppointmentByDoctor(int doctorId)
        {
            return await _context.Appointments
                .Where(a => a.DoctorId == doctorId)
                .ToListAsync(); 

        }
        // GET: api/appointments/filter?date=2025-07-07&status=Scheduled
        [HttpGet("filter")]
        public async Task<ActionResult<IEnumerable<Appointment>>> FilterAppointments(DateTime? date, string? status)
        {
            var query = _context.Appointments.AsQueryable();

            if (date.HasValue)
            {
                query = query.Where(a => a.AppointmentDateTime.Date == date.Value.Date);
            }

            if (!string.IsNullOrWhiteSpace(status))
            {
                query = query.Where(a => a.Status == status);
            }

            return await query.ToListAsync();
        }
    }
}