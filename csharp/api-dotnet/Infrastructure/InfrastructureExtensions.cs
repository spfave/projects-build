using Microsoft.EntityFrameworkCore;
using ProjectsBuild.Core.Persistence;

namespace ProjectsBuild.Infrastructure;

internal static class InfrastructureServiceCollectionExtensions
{
	internal static IServiceCollection AddInfraSqliteDatabase(
		this IServiceCollection services,
		IConfiguration configuration
	)
	{
		var connectionString =
			configuration.GetConnectionString("DB_FILE_NAME")
			?? throw new InvalidOperationException("Connection string 'DB_FILE_NAME' is not configured.");
		// services.AddSqlite<ProjectsBuildDbContext>(connectionString);
		services.AddDbContext<ProjectsBuildDbContext>(options => options.UseSqlite(connectionString));
		services.AddScoped<IProjectBuildDbContext>(services =>
			services.GetRequiredService<ProjectsBuildDbContext>()
		);
		return services;
	}
}

internal static class InfrastructureApplicationBuilderExtensions
{
	internal static async Task MigrateInfraDatabase(this IServiceProvider services)
	{
		await using (var scope = services.CreateAsyncScope())
		{
			var dbContext = scope.ServiceProvider.GetRequiredService<ProjectsBuildDbContext>();
			await dbContext.Database.MigrateAsync();
		}
	}
}
