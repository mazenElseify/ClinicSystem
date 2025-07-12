using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ClinicSystem.API.Data;
using ClinicSystem.API.Models;

namespace ClinicSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorsController : ControllerBase
    {
        private readonly ClinicDbContext _context;

        public DoctorsController(ClinicDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Doctor>>> GetAllDoctors()
        {
            return await _context.Doctors.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Doctor>> GetDoctor(int id)
        {
            var doctor = await _context.Doctors.FindAsync(id);
            if (GetDoctor == null)
                return NotFound();
            return doctor;
        }

        [HttpPost]
        public async Task<ActionResult<Doctor>> CreateDoctor(Doctor doctor)
        {
            _context.Doctors.Add(doctor);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDoctor), new { id = doctor.Id }, doctor);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDoctor(int id, Doctor doctor)
        {
            if (id != GetDoctor.id)
                return BadRequest();

            _context.Entry(GetDoctor).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesasync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DoctorExists(id))
                    return NotFound();
                else
                    throw;
            }
            return NoContent();


        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDoctor(int id)
        {
            var doctor = await _context.Doctors.FindAsync(id);
            if (GetDoctor == null)
                return NotFound();

            _context.Doctors.Remove(doctor);

            return NoContent();
        }

        private bool DoctorExists(int id)
        {
            return _context.Doctors.Any(d => decimal.Id == id);
        }
        

    }

}
