using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ProjectsBuild.Core.Domain;

namespace ProjectsBuild.Infrastructure.Persistence.Configurations;

internal sealed class ProjectConfiguration : IEntityTypeConfiguration<Project>
{
	public void Configure(EntityTypeBuilder<Project> builder)
	{
		builder.ToTable(
			"pb_projects",
			(table) =>
			{
				table.HasCheckConstraint("chk_projects_name", $"LENGTH(name) > 1 AND LENGTH(name) <= 125");
				table.HasCheckConstraint(
					"chk_projects_status",
					"status IN ('planning', 'building', 'complete')"
				);
			}
		);

		builder.HasKey(p => p.Id);

		// Note: Sqlite does not enforce text/varchar length constraints
		builder.Property(p => p.Id).HasColumnName("id").HasMaxLength(ProjectConstants.IdLength);

		builder
			.Property(p => p.Name)
			.HasColumnName("name")
			.IsRequired()
			.HasMaxLength(ProjectConstants.NameMaxLength);

		builder.Property(p => p.Link).HasMaxLength(256);

		builder.Property(p => p.Description).HasMaxLength(-1);

		builder.Property(p => p.Notes);

		builder
			.Property(p => p.Status)
			.HasColumnName("status")
			.HasConversion(
				status => status.ToString().ToLowerInvariant(),
				status => Enum.Parse<ProjectStatus>(status, true)
			)
			.IsRequired()
			.HasMaxLength(10)
			.HasDefaultValueSql("'planning'");

		builder.Property(p => p.DateCompleted);

		builder.Property(p => p.Rating);

		builder.Property(p => p.Recommend);
	}
}
