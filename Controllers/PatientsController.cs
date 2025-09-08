using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ClinicSystem.API.Data;
using ClinicSystem.API.Models;
using ClinicSystem.API.DTOs;
using Microsoft.AspNetCore.Authorization;
using AutoMapper;

namespace ClinicSystem.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PatientsController : ControllerBase
    {
        private readonly ClinicDbContext _context;
        private readonly IMapper _mapper;

        public PatientsController(ClinicDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PatientDto>>> GetPatients(int page = 1, int pageSize = 20)
        {
            var total = await _context.Patients.CountAsync();
            var patients = await _context.Patients
                .Include(p => p.Doctor)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
            var dtos = _mapper.Map<List<PatientDto>>(patients);
            return Ok(new { data = dtos, total });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PatientDto>> GetPatient(int id)
        {
            var patient = await _context.Patients
            .Include(p => p.Doctor)
            .FirstOrDefaultAsync(p => p.Id == id);

            if (patient == null)
                return NotFound();

            var dto = _mapper.Map<PatientDto>(patient);
            return Ok(dto);
        }

        [HttpGet("doctor/{doctorId}")]
        public async Task<ActionResult<IEnumerable<PatientDto>>> GetPatientsByDoctor(int doctorId)
        {
            var patients = await _context.Patients
                .Include(p => p.Doctor)
                .Where(p => p.DoctorId == doctorId)
                .ToListAsync();

            var dtos = _mapper.Map<List<PatientDto>>(patients);
            return Ok(dtos);
        }

        [HttpPost]
        public async Task<ActionResult<Patient>> CreatePatient(PatientDto dto)
        {
            if (dto.DateOfBirth == default)
                return BadRequest("BirthDate is required");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var patient = _mapper.Map<Patient>(dto);

            _context.Patients.Add(patient);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPatient), new { id = patient.Id }, patient);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePatient(int id, PatientDto dto)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null)
                return NotFound();

            _mapper.Map(dto, patient);

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePatient(int id)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null)
                return NotFound();

            _context.Patients.Remove(patient);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}