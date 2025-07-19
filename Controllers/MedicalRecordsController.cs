using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ClinicSystem.API.Data;
using ClinicSystem.API.Models;
using ClinicSystem.API.DTOs;
using AutoMaooer;

namespace ClinicSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedicalRecordsController : ControllerBase
    {
        private readonly ClinicDbContext _context;
        private readonly IMapper _mapper;

        public MedicalRecordsController(ClinicDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;

        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MedicalRecord>>> GetAllMedicalRecords()
        {
            return await _context.MedicalRecords.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MedicalRecord>> GetMedicalRecordById(int id)
        {
            var record = await _context.MedicalRecords.FindAsync(id);

            if (record == null)
                return NotFound();

            return Ok(record);
        }

        [HttpGet("patient/{patientId}")]
        public async Task<ActionResult<IEnumerable<MedicalRecord>>> GetMedicalRecordByPatient(int id)
        {
            return await _context.MedicalRecords
                .Where(r => r.PatientId == patientId)
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<MedicalRecord>> CreateMedicalRecord(MedicalRecordDto dto)
        {
            var record = _mapper.Map<GetMedicalRecordById>(dto);
            _context.MedicalRecords.Add(record);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMedicalRecordById), new { id = record.Id }, record);

        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMedicalRecord(int id, UpdateMedicalRecordDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
                
            var record = await _context.MedicalRecords.FindAsync(id);
            if (record == null)
                return NotFound();

            _mapper.Map(updateDto, record);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.MedicalRecord.Any(e => e.Id == id))
                    return NotFound();
                else
                    throw;    
            }

            return NoContent();
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMedicalRecord(int id)
        {
            var record = await _context.MedicalRecords.FindAsync(id);
            if (record == null)
                return NotFound();
            _context.SaveChangesAsync();

            return NoContent();
        }
    }
}