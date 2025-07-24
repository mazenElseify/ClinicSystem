using Microsoft.AspNetCore.Mvc;
using ClinicSystem.API.Data;
using ClinicSystem.API.Models;
using ClinicSystem.API.DTOs;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;

namespace ClinicSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ClinicDbContext _context;
        private readonly IMapper _mapper;

        public AuthController(ClinicDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;

        }
        public class LoginRequest
        {
            public string UserName { get; set; } = null!;
            public string Password { get; set; } = null!;

        }
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.UserName == loginDto.UserName);
            if (user == null )
                return Unauthorized("Invalid username or password.");

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash);
            if (!isPasswordValid)
                return Unauthorized("Invalid username or password.");

            var userDto = _mapper.Map<UserDto>(user);
            return Ok(userDto);
        }

    }
}