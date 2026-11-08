using Microsoft.EntityFrameworkCore;
using ProjectsBuild.Core.Domain;

namespace ProjectsBuild.Core.Persistence;

public interface IProjectBuildDbContext
{
	DbSet<Project> Projects { get; }

	Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
