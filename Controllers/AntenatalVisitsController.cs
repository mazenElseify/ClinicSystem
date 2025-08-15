using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using ClinicSystem.API.Data;
using ClinicSystem.API.Models;
using ClinicSystem.API.DTOs;
using AutoMapper;

namespace ClinicSystem.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AntenatalVisitsController : ControllerBase
    {
        private readonly ClinicDbContext _context;
        private readonly IMapper _mapper;

        public AntenatalVisitsController(ClinicDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;

        }
        [HttpGet("patient/{patientId}")]
        public async Task<ActionResult<IEnumerable<AntenatalVisit>>> GetByPatient(int patientId)
        {
            return await _context.AntenatalVisits
                .Include(a => a.Pregnancy)
                .Where(a => a.Pregnancy.PatientId == patientId)
                .ToListAsync();
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<AntenatalVisit>>> GetById(int id)
        {
            var visit = await _context.AntenatalVisits.FindAsync(id);
            if (visit == null) return NotFound();
            return Ok(visit);
        }
        [HttpPost]
        public async Task<ActionResult<AntenatalVisit>> Create(AntenatalVisitDto dto)
        {
            var visit = _mapper.Map<AntenatalVisit>(dto);
            _context.AntenatalVisits.Add(visit);
            await _context.SaveChangesAsync();
            return Ok(visit);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateAntenatalVisitDto dto)
        {
            var visit = await _context.AntenatalVisits.FindAsync(id);
            if (visit == null) return NotFound();
            _mapper.Map(dto, visit);
            await _context.SaveChangesAsync();
            return NoContent();
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var visit = await _context.AntenatalVisits.FindAsync(id);
            if (visit == null) return NotFound();
            _context.AntenatalVisits.Remove(visit);
            await _context.SaveChangesAsync();
            return NoContent();
        }

    }


}