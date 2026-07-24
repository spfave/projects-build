using Microsoft.AspNetCore.Http.HttpResults;

namespace ProjectsBuild.API.Routes;

internal static class ProjectRouter
{
	internal static void MapProjectRoutes(this IEndpointRouteBuilder router)
	{
		var projectRouter = router.MapGroup("/api/v1/projects").WithTags("Projects");

		projectRouter
			.MapGet("/", GetProjects)
			.WithName("Get Projects")
			.WithSummary("Get Projects")
			.WithDescription("Returns JSON list of Projects. Includes Project Id and Name only");

		projectRouter
			.MapGet("/{id}", GetProjectById)
			.WithName("Get Project by Id")
			.WithSummary("Get Project by Id")
			.WithDescription("Returns JSON representation of Project if found by Project Id");

		projectRouter
			.MapPost("/", CreateProject)
			.WithName("Create Project")
			.WithSummary("Create Project")
			.WithDescription("Creates a new Project. Returns JSON representation of created Project");

		projectRouter
			.MapPut("/{id}", UpdateProject)
			.WithName("Update Project")
			.WithSummary("Update Project")
			.WithDescription(
				"Updates Project if found by Id. Returns JSON representation of updated Project otherwise not-found"
			);

		projectRouter
			.MapDelete("/{id}", DeleteProject)
			.WithName("Delete Project")
			.WithSummary("Delete Project")
			.WithDescription(
				"Deletes Project if found by Id. Returns JSON representation of deleted Project otherwise not-found"
			);
	}

	private static async Task<Ok<IReadOnlyList<Project>>> GetProjects()
	{
		IReadOnlyList<Project> projects =
		[
			new() { Id = 1, Name = "Proj 1" },
			new() { Id = 2, Name = "Proj 2" },
		];
		return TypedResults.Ok(projects);
	}

	private static async Task<Ok<Project>> GetProjectById(int id)
	{
		Project project = new() { Id = 1, Name = "Project By Id" };
		return TypedResults.Ok(project);
	}

	private static async Task<Created<Project>> CreateProject(Project payload)
	{
		Project project = new() { Id = 1, Name = "Project Created" };
		return TypedResults.Created($"/projects/{project.Id}", project);
	}

	private static async Task<Ok<Project>> UpdateProject(int id, Project payload)
	{
		Project project = new() { Id = 1, Name = "Project Updated" };
		return TypedResults.Ok(project);
	}

	private static async Task<Ok<Project>> DeleteProject(int id)
	{
		Project project = new() { Id = 1, Name = "Project Deleted" };
		return TypedResults.Ok(project);
	}
}

public sealed class Project
{
	public int Id { get; init; }
	public required string Name { get; set; }
}
