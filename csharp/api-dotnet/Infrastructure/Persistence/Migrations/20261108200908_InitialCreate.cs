using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjectsBuild.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "pb_projects",
                columns: table => new
                {
                    id = table.Column<string>(type: "TEXT", maxLength: 8, nullable: false),
                    name = table.Column<string>(type: "TEXT", maxLength: 125, nullable: false),
                    Link = table.Column<string>(type: "TEXT", maxLength: 256, nullable: true),
                    Description = table.Column<string>(type: "TEXT", maxLength: -1, nullable: true),
                    Notes = table.Column<string>(type: "TEXT", nullable: true),
                    status = table.Column<string>(type: "TEXT", maxLength: 10, nullable: false, defaultValueSql: "'planning'"),
                    DateCompleted = table.Column<DateOnly>(type: "TEXT", nullable: true),
                    Rating = table.Column<int>(type: "INTEGER", nullable: true),
                    Recommend = table.Column<bool>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_pb_projects", x => x.id);
                    table.CheckConstraint("chk_projects_name", "LENGTH(name) > 1 AND LENGTH(name) <= 125");
                    table.CheckConstraint("chk_projects_status", "status IN ('planning', 'building', 'complete')");
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "pb_projects");
        }
    }
}
