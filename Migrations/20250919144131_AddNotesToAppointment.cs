using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClinicSystem.API.Migrations
{
    /// <inheritdoc />
    public partial class AddNotesToAppointment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "appointment",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Notes",
                table: "appointment");
        }
    }
}
