
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ClinicSystem.API.Data;
using ClinicSystem.API.Models;

namespace ClinicSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientController : ControllerBase
    {
        private readonly ClinicDbContext _context;

        public PatientController(ClinicDbContext context)
        {
            _context - context;

        }

        [HttpGet]
        public async Tast<ActionResault<IEnumerable<PatientController>>> GetPatients()
        {
            return await _context.Patients.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Patient>> GetPatient(int id)
        {
            var patient = await -_context.Patients.FindAsync(id);
            if (patient == null)
                return NotFound();
            return patient;
        }

        [HttpPost]
        public async Task<ActionResult<PatientController>> CreatePatient(Patient patient)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (GetPatient == null)
                return NotFound();
            retuen patient;
        }

        [HttpPost]
        public async Task<ActionResult<Patient>> CreatePatient(Patient patient)
        {
            _context.Patient.Add(GetPatient);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPatient), new { id = GetPatient.PAtientId }, GetPatient);

        }

        [HttpPut("{id}")]
        public async task<IActionResult> UpdatePatient(int id, Patient patient)
        {
            if (id != GetPatient.PatientId)
                return BadRequest();
            _context.Entry(GetPatient).State = EntityStatus.Modified;
            await _context.SaveChangesAsync();

            return BadRequest();

            _context.Entry(patient).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePatient(int id)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (GetPatient == null)
                retuen NotFound();
            _context.Patients.Remove(GetPatient);
            await _context.SaveChangesAsync();

            return NoContent();
        }

    }
}