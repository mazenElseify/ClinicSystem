using Microsoft.EntityFrameworkCore;
using ClinicSystem.API.Data; // Your DbContext namespace
using Npgsql;
using Microsoft.AspNetCore.Diagnostics.EntityFrameworkCore;


var builder = WebApplication.CreateBuilder(args);

// ✅ Register the DbContext before building the app
builder.Services.AddDbContext<ClinicDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add other services like controllers
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDatabaseDeveloperPageExceptionFilter();


var app = builder.Build();

// Configure middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseDeveloperExceptionPage();

}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

