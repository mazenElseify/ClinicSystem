using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using ClinicSystem.API.Models;
using ClinicSystem.API.Data;
using ClinicSystem.API.DTOs;

namespace ClinicSystem.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class InvoicesController : ControllerBase
    {
        private readonly ClinicDbContext _context;
        private readonly IMapper _mapper;
        public InvoicesController(ClinicDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        [HttpGet("patient/{patientId}")]
        public async Task<ActionResult<IEnumerable<Invoice>>> GetByPatient(int patientId)
        {
            return await _context.Invoices
                .Where(i => i.PatientId == patientId)
                .ToListAsync();
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Invoice>> GetById(int id)
        {
            var invoice = await _context.Invoices.FindAsync(id);
            if (invoice == null) return NotFound();
            return Ok(invoice);
        }
        [HttpPost]
        public async Task<ActionResult> Create(InvoiceDto dto)
        {
            var invoice = _mapper.Map<Invoice>(dto);
            _context.Invoices.Add(invoice);
            await _context.SaveChangesAsync();
            return Ok(invoice);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, InvoiceDto dto)
        {
            var invoice = await _context.Invoices.FindAsync(id);
            if (invoice == null) return NotFound();
            _mapper.Map(dto, invoice);
            await _context.SaveChangesAsync();
            return NoContent();

        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var invoice = await _context.Invoices.FindAsync(id);
            if (invoice == null) return NotFound();
            _context.Invoices.Remove(invoice);
            return NoContent();

        }


    }

}