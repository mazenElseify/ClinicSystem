using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ClinicSystem.API.Data;
using ClinicSystem.API.Models;
using ClinicSystem.API.DTOs;
using AutoMapper;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;

namespace ClinicSystem.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ObstetricHistoriesController : ControllerBase
    {
        private readonly ClinicDbContext _context;
        private readonly IMapper _mapper;

        public ObstetricHistoriesController(ClinicDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;

        }
        [HttpGet("patient/{patientId}")]
        public async Task<ActionResult<IEnumerable<ObstetricHistory>>> GetByPatient(int patientId)
        {
            return await _context.ObstetricHistories
                .Where(o => o.PatientId == patientId)
                .ToListAsync();

        }
        [HttpGet("{id}")]
        public async Task<ActionResult<ObstetricHistory>> GetById(int id)
        {
            var history = await _context.ObstetricHistories.FindAsync(id);
            if (history == null) return NotFound();
            return Ok(history);

        }
        [HttpPost]
        public async Task<ActionResult<ObstetricHistory>> Create(ObstetricHistoryDto dto)
        {
            var history = _mapper.Map<ObstetricHistory>(dto);
            _context.ObstetricHistories.Add(history);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = history.Id }, history);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateObstetricHistoryDto dto)
        {
            var history = await _context.ObstetricHistories.FindAsync(id);
            if (history == null) return NotFound();
            await _context.SaveChangesAsync();

            return NoContent();


        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var history = await _context.ObstetricHistories.FindAsync(id);
            if (history == null) return NotFound();
            _context.ObstetricHistories.Remove(history);
            return NoContent();
        }

    }
}
