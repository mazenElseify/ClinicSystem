using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using ClinicSystem.API.Data;
using ClinicSystem.API.DTOs;
using ClinicSystem.API.Models;
using AutoMapper;

namespace ClinicSystem.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class LabTestsController : ControllerBase
    {
        private readonly ClinicDbContext _context;
        private readonly IMapper _mapper;

        public LabTestsController(ClinicDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        [HttpGet("patient/{patientId}")]
        public async Task<ActionResult<IEnumerable<LabTest>>> GetByPatient(int patientId)
        {
            return await _context.LabTests
                .Where(l => l.PatientId == patientId)
                .ToListAsync();
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<LabTest>> GetById(int id)
        {
            var test = await _context.LabTests.FindAsync(id);
            if (test == null) return NotFound();
            return Ok(test);
        }
        [HttpPost]
        public async Task<ActionResult<LabTest>> Create(LabTestDto dto)
        {
            var test = _mapper.Map<LabTest>(dto);
            _context.LabTests.Add(test);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = test.Id }, test);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateLabTestDto dto)
        {
            var test = await _context.LabTests.FindAsync(id);
            if (test == null) return NotFound();
            _mapper.Map(dto, test);
            await _context.SaveChangesAsync();
            return NoContent();
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var test = await _context.LabTests.FindAsync(id);
            if (test == null) return NotFound();
            _context.LabTests.Remove(test);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}