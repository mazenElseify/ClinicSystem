using Microsoft.AspNetCore.Mvc;
using ClinicSystem.API.Models;
using ClinicSystem.API.Data;
using ClinicSystem.API.DTOs;
using AutoMapper;
using Microsoft.EntityFrameworkCore;


namespace ClinicSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ClinicDbContext _context;
        private readonly IMapper _mapper;

        public UsersController(ClinicDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;

        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            var users = await _context.Users.ToListAsync();
            return Ok(_mapper.Map<IEnumerable<UserDto>>(users));

        }
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
                return NotFound();
            return Ok(_mapper.Map<UserDto>(user));
        }

        [HttpPost]
        public async Task<ActionResult<UserDto>> CreateUser(CreateUserDto userDto)
        {
            var user = _mapper.Map<User>(userDto);
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(userDto.Password);

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, _mapper.Map<UserDto>(user));

        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UpdateUserDto updateDto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound();

            _mapper.Map(updateDto, user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound();

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

    }
}

