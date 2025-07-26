using Microsoft.AspNetCore.Mvc;
using ClinicSystem.API.Models;
using ClinicSystem.API.Data;
using ClinicSystem.API.DTOs;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;


namespace ClinicSystem.API.Controllers
{
    [Authorize]
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
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            var users = await _context.Users.ToListAsync();
            return Ok(_mapper.Map<IEnumerable<UserDto>>(users));

        }
        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
                return NotFound();
            return Ok(_mapper.Map<UserDto>(user));
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<UserDto>> CreateUser(CreateUserDto userDto)
        {
            var user = _mapper.Map<User>(userDto);
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(userDto.Password);

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, _mapper.Map<UserDto>(user));

        }

        [Authorize]
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


        [Authorize]
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

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == request.UserName);
            if (user == null)
                return Unauthorized(new { message = "User not found." });

            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                return Unauthorized(new { message = "Incorrect password." });

            var token = GenerateJwtToken(user);

            return Ok(new
            {
                id = user.Id,
                userName = user.UserName,
                email = user.Email,
                role = user.Role,
                phone = user.Phone,
                isActive = user.IsActive,
                token = token
            });
        }
        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                new Claim("id", user.Id.ToString()),
                new Claim("role", user.Role)
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("KeepItSimpleStupid.2511"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddHours(8),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
            
        }

        public class LoginRequest
        {
            public string UserName { get; set; } = null!;
            public string Password { get; set; } = null!;
        }

    }
}

