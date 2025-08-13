using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ClinicSystem.API.Data;
using ClinicSystem.API.Models;
using ClinicSystem.API.DTOs;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication;

namespace ClinicSystem.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class GynecologicalHistoriesController : ControllerBase
    {
        private readonly ClinicDbContext _context;
        private readonly IMapper _mapper;


        public GynecologicalHistoriesController(ClinicDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        [HttpGet("patient/{patientId}")]
        public async Task<ActionResult<IEnumerable<GynecologicalHistory>>> GetByPatient(int patientId)
        {
            return await _context.GynecologicalHistories
            .Where(g => g.PatientId == patientId)
            .ToListAsync();
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<GynecologicalHistory>> GetById(int id)
        {
            var history = await _context.GynecologicalHistories.FindAsync(id);
            if (history == null) return NotFound();
            return Ok(history);
        }
        [HttpPost]
        public async Task<ActionResult<GynecologicalHistory>> Create(GynecologicalHistoryDto dto)
        {
            var history = _mapper.Map<GynecologicalHistory>(dto);
            _context.GynecologicalHistories.Add(history);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = history.Id }, history);

        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateGynecologicalHistoryDto dto)
        {
            var history = await _context.GynecologicalHistories.FindAsync(id);
            if (history == null) return NotFound();
            _mapper.Map(dto, history);
            await _context.SaveChangesAsync();
            return NoContent();

        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var history = await _context.GynecologicalHistories.FindAsync(id);
            if (history == null) return NotFound();
            _context.GynecologicalHistories.Remove(history);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}