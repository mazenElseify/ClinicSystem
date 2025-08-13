using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ClinicSystem.API.Data;
using ClinicSystem.API.Models;
using Microsoft.AspNetCore.Authorization;



namespace ClinicSystem.API.Controllers
{
    [Authorize]
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

        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<Doctor>> GetDoctor(int id)
        {
            var doctor = await _context.Doctors.FindAsync(id);

            if (doctor == null)
                return NotFound();

            return Ok(doctor);
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Doctor>> CreateDoctor(Doctor doctor)
        {
            _context.Doctors.Add(doctor);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDoctor), new { id = doctor.Id }, doctor);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDoctor(int id, Doctor doctor)
        {
            if (id != doctor.Id)
                return BadRequest();

            _context.Entry(doctor).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Doctors.Any(e => e.Id == id))
                    return NotFound();
                else
                    throw;
            }
            return NoContent();


        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDoctor(int id)
        {
            var doctor = await _context.Doctors.FindAsync(id);
            if (doctor == null)
                return NotFound();

            _context.Doctors.Remove(doctor);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        [Authorize]
        [HttpGet("by-user/{userId}")]
        public async Task<ActionResult<DoctorDto>> GetDoctorByUserId(int userId)
        {
            var doctor = await _context.Doctors
                .Where(d => d.UserId == userId)
                .Select(d => new DoctorDto
                {
                    Id = d.Id,
                    FirstName = d.FirstName,
                    LastName = d.LastName,
                    Gender = d.Gender,
                    Specialty = d.Specialty,
                    Phone = d.Phone,
                    Email = d.Email,
                    LicenseNumber = d.LicenseNumber,
                    UserId = d.UserId,
                    CreatedAt = d.CreatedAt,
                    MaritalStatus = d.MaritalStatus 

                })
                .FirstOrDefaultAsync();

            if (doctor == null)
            { 
                Console.WriteLine($"No doctor found for userId: {userId}");
                return NotFound();
            }
            return doctor;
        }

        private bool DoctorExists(int id)
        {
            return _context.Doctors.Any(d => d.Id == id);
        }
        

    }

}
