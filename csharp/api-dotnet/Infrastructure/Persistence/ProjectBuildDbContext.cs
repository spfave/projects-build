using Microsoft.EntityFrameworkCore;
using ProjectsBuild.Core.Domain;
using ProjectsBuild.Core.Persistence;

namespace ProjectsBuild.Infrastructure;

public sealed class ProjectsBuildDbContext(DbContextOptions<ProjectsBuildDbContext> options)
	: DbContext(options),
		IProjectBuildDbContext
{
	public DbSet<Project> Projects => Set<Project>();

	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
		// modelBuilder.HasDefaultSchema("pb"); // note: SQLite does not support schemas
		modelBuilder.ApplyConfigurationsFromAssembly(typeof(ProjectsBuildDbContext).Assembly);
		base.OnModelCreating(modelBuilder);
	}
}
