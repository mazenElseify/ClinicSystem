using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication;
using ClinicSystem.API.Models;
using ClinicSystem.API.Data;
using ClinicSystem.API.DTOs;
using AutoMapper;
using Npgsql.EntityFrameworkCore.PostgreSQL.Query.Expressions;

namespace ClinicSystem.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PrescriptionsController : ControllerBase
    {
        private readonly ClinicDbContext _context;
        private readonly IMapper _mapper;

        public PrescriptionsController(ClinicDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        [HttpGet("patient/{patientId}")]
        public async Task<ActionResult<IEnumerable<Prescription>>> GetByPatient(int patientId)
        {
            return await _context.Prescriptions
                .Where(p => p.PatientId == patientId)
                .ToListAsync();
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<Prescription>>> GetById(int id)
        {
            var prescription = await _context.Prescriptions.FindAsync(id);
            if (prescription == null) return NotFound();
            return Ok(prescription);
        }
        [HttpPost]
        public async Task<ActionResult<Prescription>> Create(PrescriptionDto dto)
        {
            var prescription = _mapper.Map<Prescription>(dto);
            _context.Prescriptions.Add(prescription);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = prescription.Id }, prescription);

        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdatePrescriptionDto dto)
        {
            var prescription = await _context.Prescriptions.FindAsync(id);
            if (prescription == null) return NotFound();
            _mapper.Map(dto, prescription);
            await _context.SaveChangesAsync();
            return NoContent();

        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var prescription = await _context.Prescriptions.FindAsync(id);
            if (prescription == null) return NotFound();
            _context.Prescriptions.Remove(prescription);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}